import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

/**
 * Custom hook to handle user authentication and state management.
 * @returns {Object} An object containing the authenticated user and the initializing state.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Configure Google Sign-In with the web client ID
    GoogleSignin.configure({
      webClientId:
        '290999401549-28sv0ta1mhh68drtsi40nr5vmlvnpoa6.apps.googleusercontent.com',
    });

    // Subscribe to authentication state changes
    const subscriber = auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        try {
          // Fetch user data from Firestore
          const userDoc = await firestore()
            .collection('User_Accounts')
            .doc(authUser.uid)
            .get();
          const userData = userDoc.data() || {};

          // Set the authenticated user state
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            profileComplete: userData.profileComplete || false,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }

      // Set the initializing state to false after the first load
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription on unmount
    return subscriber;
  }, [initializing]);

  return { user, initializing };
};
