import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../components/Authentication";
import TabNavigator from "../components/TabNavigator";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import PersonalDetailsScreen from "../screens/PersonalDetailsScreen";

const Stack = createNativeStackNavigator();

const SignUpStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignUp" component={SignUpScreen} />

    <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
  </Stack.Navigator>
);

/**
 * LandingPage component manages the initial navigation flow of the app.
 * It shows a welcome screen initially, then navigates to the main app or authentication screens based on the user's authentication state.
 */
const LandingPage = () => {
  const { user, initializing } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show the welcome screen for 2 seconds
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  // Show the welcome screen if initializing or showWelcome is true
  if (initializing || showWelcome) return <WelcomeScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // If user is authenticated, navigate to the main app
          <Stack.Screen name="MainApp" component={TabNavigator} />
        ) : (
          // If user is not authenticated, show SignIn and SignUp screens
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LandingPage;
