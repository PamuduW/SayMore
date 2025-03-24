import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import './firebase-messaging-headless-task';

/**
 * Register the main application component with the AppRegistry.
 * @param {string} appName - The name of the application.
 * @param {function} App - The main application component.
 */
AppRegistry.registerComponent(appName, () => App);

/**
 * Set a background message handler for Firebase Cloud Messaging.
 * @param {function} remoteMessage - The message received in the background.
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});