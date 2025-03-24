import messaging from '@react-native-firebase/messaging';

/**
 * Set a background message handler for Firebase Cloud Messaging.
 * This handler will be triggered when a message is received while the app is in the background.
 * @param {function} remoteMessage - The message received in the background.
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});