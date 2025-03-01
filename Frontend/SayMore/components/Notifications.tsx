import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

/**
 * Custom hook to manage notifications.
 * Requests user permissions, retrieves the device token, sets up in-app messaging,
 * and handles foreground and background messages.
 */
export const useNotifications = () => {
  useEffect(() => {
    /**
     * Requests user permission for notifications.
     * On Android 13 and above, requests POST_NOTIFICATIONS permission.
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
     * Retrieves the device token for push notifications.
     */
    const getToken = async () => {
      await messaging().getToken();
    };

    /**
     * Sets up in-app messaging to display messages.
     */
    const setupInAppMessaging = () => {
      inAppMessaging().setMessagesDisplaySuppressed(false);
    };

    /**
     * Handles foreground messages by displaying a notification.
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

    // Subscribe to foreground messages
    const unsubscribeOnMessage = messaging().onMessage(handleForegroundMessage);

    // Create a default notification channel
    notifee.createChannel({ id: 'default', name: 'Default Channel' });

    // Set up background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Cleanup subscription on unmount
    return unsubscribeOnMessage;
  }, []);
};
