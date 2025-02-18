import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../components/Authentication";
import firestore from "@react-native-firebase/firestore";

import TabNavigator from "../components/TabNavigator";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";

const Stack = createNativeStackNavigator();

const LandingPage = () => {
  const { user, initializing } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // Show welcome screen for 2 seconds
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check Firestore for profile completion status
    if (user) {
      const checkProfile = async () => {
        try {
          const userDoc = await firestore().collection("User_Accounts").doc(user.uid).get();
          setProfileComplete(userDoc.exists && userDoc.data()?.profileComplete);
        } catch (error) {
          console.error("Error fetching profile data: ", error);
        } finally {
          setLoadingProfile(false);
        }
      };

      checkProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [user]);

  // Show welcome screen if initializing or still showing welcome
  if (initializing || showWelcome || loadingProfile) return <WelcomeScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          profileComplete ? (
            <Stack.Screen name="MainApp" component={TabNavigator} />
          ) : (
            <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
          )
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LandingPage;