import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MoreScreen from '../screens/MoreScreen';
import LessonsScreen from '../screens/LessonsScreen';
import AccountScreen from '../screens/AccountScreen';

import HomeIcon from '../assets/home.png';
import MoreInfoIcon from '../assets/more-info.png';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MoreStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MoreScreen" component={MoreScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="Lessons" component={LessonsScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused }) => {
      const icons = {
        Home: HomeIcon,
        More: MoreInfoIcon,
        Account: MoreInfoIcon,
      };
      return (
        <Image
          source={icons[route.name]}
          style={{
            width: 25,
            height: 25,
            tintColor: focused ? '#003366' : 'gray',
          }}
        />
      );
    },
    tabBarActiveTintColor: '#003366',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: {
      backgroundColor: '#F0F8FF',
      borderTopWidth: 0,
      elevation: 0,
    },
    headerShown: false,
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="More" component={MoreStack} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;