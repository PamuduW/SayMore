import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import MoreScreen from '../screens/MoreScreen';
import LessonsScreen from '../screens/LessonsScreen';
import AccountScreen from '../screens/AccountScreen';
import AudioScreen from '../screens/AudioScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AdditionalDetailsScreen from '../screens/AdditionalDetailsScreen';
import Difficulty from "../screens/Difficulty";
import PublicSpeakQuestionScreen from "../screens/PublicSpeakQuestionScreen";
import PointsScreen from "../screens/PointsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

// Icons
import HomeIcon from '../assets/home.png';
import MoreInfoIcon from '../assets/more-info.png';
import UserAccIcon from '../assets/useracc.png';

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Audio" component={AudioScreen} />
    <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
    <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
    <Stack.Screen name="AdditionalDetailsScreen" component={AdditionalDetailsScreen} />
  </Stack.Navigator>
);

// More Stack
const MoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreScreen" component={MoreScreen} />
    <Stack.Screen name="Lessons" component={LessonsScreen} />
    <Stack.Screen name="Difficulty" component={Difficulty} />
    <Stack.Screen name="PublicSpeakQuestionScreen" component={PublicSpeakQuestionScreen} />
    <Stack.Screen name="PointsScreen" component={PointsScreen} />
  </Stack.Navigator>
);

// Account Stack
const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountScreen" component={AccountScreen} />
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

// Tab Options
const screenOptions = (route, theme) => {
  const icons = {
    Home: HomeIcon,
    More: MoreInfoIcon,
    Account: UserAccIcon,
  };

  return {
    tabBarIcon: ({ focused }) => (
      <Image
        source={icons[route.name]}
        style={[styles.icon, focused ? styles.activeIcon : styles.inactiveIcon]}
      />
    ),
    tabBarActiveTintColor: '#003366',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: {
      backgroundColor: theme === 'dark' ? '#333333' : '#F0F8FF',
      borderTopWidth: 0,
      elevation: 0,
    },
    headerShown: false,
  };
};

// Main Tab Navigator
const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator screenOptions={({ route }) => screenOptions(route, theme)}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="More" component={MoreStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
  activeIcon: {
    tintColor: '#003366',
  },
  inactiveIcon: {
    tintColor: 'gray',
  },
});

export default TabNavigator;
