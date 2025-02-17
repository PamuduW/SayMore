import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MoreScreen from "../screens/MoreScreen";
import LessonsScreen from "../screens/LessonsScreen";
import AccountScreen from "../screens/AccountScreen";
import AudioScreen from "../screens/AudioScreen";
import AnalysisScreen from "../screens/AnalysisScreen";
import ChartScreen from "../screens/ChartScreen";

import HomeIcon from "../assets/home.png";
import MoreInfoIcon from "../assets/more-info.png";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Stack navigator for the "More" tab.
 * Contains the MoreScreen and LessonsScreen.
 */
const MoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreScreen" component={MoreScreen} />
    <Stack.Screen name="Lessons" component={LessonsScreen} />
    <Stack.Screen name="Chart" component={ChartScreen} />
  </Stack.Navigator>
);

/**
 * Stack navigator for the "Home" tab.
 * Contains the HomeScreen, AudioScreen, and AnalysisScreen.
 */
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Audio" component={AudioScreen} />
    <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
  </Stack.Navigator>
);

/**
 * Function to get screen options for the tab navigator.
 * Sets the tabBarIcon, tabBarActiveTintColor, tabBarInactiveTintColor, tabBarStyle, and headerShown.
 * @param {Object} route - The route object.
 * @returns {Object} The screen options.
 */
const getScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => {
    const icons = {
      Home: HomeIcon,
      More: MoreInfoIcon,
      Account: MoreInfoIcon,
    };
    return (
      <Image
        source={icons[route.name]}
        style={[styles.icon, focused ? styles.activeIcon : styles.inactiveIcon]}
      />
    );
  },
  tabBarActiveTintColor: "#003366",
  tabBarInactiveTintColor: "gray",
  tabBarStyle: {
    backgroundColor: "#F0F8FF",
    borderTopWidth: 0,
    elevation: 0,
  },
  headerShown: false,
});

/**
 * Tab navigator component.
 * Contains the HomeStack, MoreStack, and AccountScreen.
 */
const TabNavigator = () => (
  <Tab.Navigator screenOptions={getScreenOptions}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="More" component={MoreStack} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
  activeIcon: {
    tintColor: "#003366",
  },
  inactiveIcon: {
    tintColor: "gray",
  },
});

export default TabNavigator;
