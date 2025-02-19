import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "290999401549-28sv0ta1mhh68drtsi40nr5vmlvnpoa6.apps.googleusercontent.com",
    });

    const subscriber = auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        try {
          const userDoc = await firestore().collection("User_Accounts").doc(authUser.uid).get();
          const userData = userDoc.data() || {};

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

    return subscriber;
  }, [initializing]);

  return { user, initializing };
};
