import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, PermissionsAndroid, Platform, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import inAppMessaging from '@react-native-firebase/in-app-messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import MoreScreen from './screens/MoreScreen';
import AccountScreen from './screens/AccountScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';

// Import your custom icons
import HomeIcon from './assets/home.png';
import MoreInfoIcon from './assets/more-info.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MoreStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="MoreScreen" component={MoreScreen} />
        <Stack.Screen name="Lessons" component={LessonsScreen} />
        <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          switch (route.name) {
            case 'Home':
              icon = HomeIcon;
              break;
            case 'More':
              icon = MoreInfoIcon;
              break;
              case 'Account':
              icon = MoreInfoIcon;
              break;
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
      <Tab.Screen name="More" component={MoreStack} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Configure Google Sign In
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await GoogleSignin.configure({
          webClientId: '290999401549-28sv0ta1mhh68drtsi40nr5vmlvnpoa6.apps.googleusercontent.com',
        });

        await requestUserPermission();
        await getToken();
        setupInAppMessaging();
      } catch (error) {
        console.error('Firebase initialization error:', error);
        Alert.alert('Initialization Error', 'Failed to set up Firebase services');
      }
    };

    initializeFirebase();
  }, []);

  const requestUserPermission = async () => {
    try {
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
    } catch (error) {
      console.error('Permission request error:', error);
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
    try {
      inAppMessaging().setMessagesDisplaySuppressed(false);
      console.log('Firebase In-App Messaging initialized.');
    } catch (error) {
      console.error('In-App Messaging setup error:', error);
    }
  };

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged);

    const messagingUnsubscribe = messaging().onMessage(async (remoteMessage) => {
      try {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: 'default',
          },
        });
      } catch (error) {
        console.error('Notification display error:', error);
      }
    });

    notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return () => {
      authSubscriber();
      messagingUnsubscribe();
    };
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <Stack.Screen name="MainApp" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}