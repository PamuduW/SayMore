import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import LessonsScreen from './screens/LessonsScreen';

// Import your custom icons
import HomeIcon from './assets/home.png';
import LessonsIcon from './assets/lessons.png';
import ActivityIcon from './assets/activity.png';
import MoreInfoIcon from './assets/more-info.png';

const Tab = createBottomTabNavigator();

export default function App() {
  const requestUserPermission = async () => {
    // Handle Android 13+ notification permissions
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification Authorization status:', authStatus);
    } else {
      console.log('Notification permissions not granted.');
    }
  };

  const getToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
    } catch (error) {
      console.error('Error fetching FCM token:', error);
    }
  };

  const setupInAppMessaging = () => {
    inAppMessaging().setMessagesDisplaySuppressed(false); // Enable in-app messages
    console.log('Firebase In-App Messaging initialized.');
  };

  useEffect(() => {
    // Request notification permissions and retrieve FCM token
    requestUserPermission();
    getToken();
    setupInAppMessaging();

    // Listener for foreground FCM messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', remoteMessage);

      // Display notification using notifee
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
        },
      });
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let icon;

            // Map route names to custom icons
            if (route.name === 'Home') {
              icon = HomeIcon;
            } else if (route.name === 'Lessons') {
              icon = LessonsIcon;
            } else if (route.name === 'Activity') {
              icon = ActivityIcon;
            } else if (route.name === 'More Info') {
              icon = MoreInfoIcon;
            }

            return (
              <Image
                source={icon}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#003366' : 'gray',
                }}
              />
            );
          },
          tabBarActiveTintColor: '#003366',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#F0F8FF',
            borderTopWidth: 0,
            elevation: 0,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Lessons" component={LessonsScreen} />
        <Tab.Screen name="Activity" component={() => null} />
        <Tab.Screen name="More Info" component={() => null} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}