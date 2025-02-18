import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

/**
 * Custom hook to manage user authentication state.
 * Configures Google Sign-In and listens for authentication state changes.
 * Fetches user profile data from Firestore and checks if profile is complete.
 *
 * @returns {Object} - An object containing the authenticated user, profile status, and initialization state.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Configure Google Sign-In with the web client ID
    GoogleSignin.configure({
      webClientId: "290999401549-28sv0ta1mhh68drtsi40nr5vmlvnpoa6.apps.googleusercontent.com",
    });

    // Subscribe to authentication state changes
    const subscriber = auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          // Fetch user data from Firestore
          const userDoc = await firestore().collection("User_Accounts").doc(authUser.uid).get();
          const userData = userDoc.exists ? userDoc.data() : {};

          setUser({
            uid: authUser.uid,
            email: authUser.email,
            profileComplete: userData.profileComplete || false,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }

      if (initializing) setInitializing(false);
    });

    // Cleanup subscription on unmount
    return subscriber;
  }, [initializing]);

  return { user, initializing };
};