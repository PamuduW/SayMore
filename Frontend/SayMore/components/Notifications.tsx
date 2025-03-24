import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

/**
 * Custom hook to handle notifications setup and permissions.
 */
export const useNotifications = () => {
  useEffect(() => {

    /**
     * Requests user permission for notifications on Android.
     */
    const requestUserPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
      await messaging().requestPermission();
    };

    /**
     * Retrieves the FCM token for the device.
     */
    const getToken = async () => {
      await messaging().getToken();
    };

    /**
     * Configures in-app messaging settings.
     */
    const setupInAppMessaging = () => {
      inAppMessaging().setMessagesDisplaySuppressed(false);
    };

    /**
     * Handles foreground messages and displays notifications.
     * @param {Object} remoteMessage - The message received while the app is in the foreground.
     */
    const handleForegroundMessage = async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: { channelId: 'default' },
      });
    };

    requestUserPermission();
    getToken();
    setupInAppMessaging();

    const unsubscribeOnMessage = messaging().onMessage(handleForegroundMessage);

    notifee.createChannel({ id: 'default', name: 'Default Channel' });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return unsubscribeOnMessage;
  }, []);
};