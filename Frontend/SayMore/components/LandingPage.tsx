import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../components/Authentication";
import firestore from "@react-native-firebase/firestore";

import TabNavigator from "../components/TabNavigator";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import PersonalDetailsScreen from "../screens/PersonalDetailsScreen";

const Stack = createNativeStackNavigator();

const LandingPage = () => {
  const { user, initializing } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection("User_Accounts")
        .doc(user.uid)
        .onSnapshot(
          doc => {
            setProfileComplete(doc.exists && doc.data()?.profileComplete);
            setLoadingProfile(false);
          },
          error => {
            console.error("Error fetching profile data: ", error);
            setLoadingProfile(false);
          },
        );

      return () => unsubscribe();
    } else {
      setLoadingProfile(false);
    }
  }, [user]);

  if (initializing || showWelcome || loadingProfile) return <WelcomeScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          profileComplete ? (
            <Stack.Screen name="MainApp" component={TabNavigator} />
          ) : (
            <Stack.Screen name="PersonalDetailsScreen" component={PersonalDetailsScreen} />
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
