import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MoreScreen from "../screens/MoreScreen";
import LessonsScreen from "../screens/LessonsScreen";
import AccountScreen from "../screens/AccountScreen";
import ActivityScreen from "../screens/ActivityScreen";

import HomeIcon from "../assets/home.png";
import MoreInfoIcon from "../assets/more-info.png";
import AccountIcon from "../assets/account.png";

type TabParamList = {
  Home: undefined;
  More: undefined;
  Account: undefined;
};

type MoreStackParamList = {
  MoreScreen: undefined;
  Lessons: undefined;
  ActivityScreen: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<MoreStackParamList>();

const MoreStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MoreScreen" component={MoreScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Lessons" component={LessonsScreen} />
    <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
  </Stack.Navigator>
);

const getScreenOptions = ({ route }: { route: { name: keyof TabParamList } }) => ({
  tabBarIcon: ({ focused }: { focused: boolean }) => {
    const icons = {
      Home: HomeIcon,
      More: MoreInfoIcon,
      Account: AccountIcon,
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

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={getScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="More" component={MoreStack} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: { width: 25, height: 25 },
  activeIcon: { tintColor: "#003366" },
  inactiveIcon: { tintColor: "gray" },
});

export default TabNavigator;
