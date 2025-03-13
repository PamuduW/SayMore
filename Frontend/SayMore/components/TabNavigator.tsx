import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import MoreScreen from '../screens/MoreScreen';
import LessonsScreen from '../screens/LessonsScreen';
import AccountScreen from '../screens/AccountScreen';
import AudioScreen from '../screens/AudioScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import VideoListScreen from '../screens/VideoListScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import PointsScreen from '../screens/PointsScreen';
import HistoryScreen from '../screens/HistoryScreen';

import HomeIcon from '../assets/home.png';
import MoreInfoIcon from '../assets/more-info.png';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreScreen" component={MoreScreen} />
    <Stack.Screen name="Lessons" component={LessonsScreen} />
    <Stack.Screen name="VideoList" component={VideoListScreen} />
    <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    <Stack.Screen name="PointsScreen" component={PointsScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Audio" component={AudioScreen} />
    <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
  </Stack.Navigator>
);

const screenOptions = (route, theme) => {
  const icons = {
    Home: HomeIcon,
    More: MoreInfoIcon,
    Account: MoreInfoIcon,
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

const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator screenOptions={({ route }) => screenOptions(route, theme)}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="More" component={MoreStack} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

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
