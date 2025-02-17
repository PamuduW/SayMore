import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import LessonsScreen from './screens/LessonsScreen';
import MoreScreen from './screens/MoreScreen';
import VideoListScreen from './screens/VideoListScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';

// Import your custom icons
import HomeIcon from './assets/home.png';
import LessonsIcon from './assets/lessons.png';
import ActivityIcon from './assets/activity.png';
import MoreInfoIcon from './assets/more-info.png';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon = null; // Explicitly initialize icon
          // Map route names to custom icons
          if (route.name === 'Home') {
            icon = HomeIcon;
          } else if (route.name === 'Lessons') {
            icon = LessonsIcon;
          } else if (route.name === 'Activity') {
            icon = ActivityIcon;
          } else if (route.name === 'More') {
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
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const requestUserPermission = async () => {
    // Handle Android 13+ notification permissions
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
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
      try {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: 'default',
          },
        });
      } catch (error) {
        console.error('Error displaying notification:', error);
      }
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="VideoList" component={VideoListScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
