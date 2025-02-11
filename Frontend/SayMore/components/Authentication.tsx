import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "290999401549-28sv0ta1mhh68drtsi40nr5vmlvnpoa6.apps.googleusercontent.com",
    });

    const onAuthStateChanged = (authUser: any) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    };

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // Cleanup function
  }, [initializing]);

  return { user, initializing };
};
