import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Import Screens
import HomeScreen from './screens/HomeScreen';

// Import your custom icons
import HomeIcon from './assets/home.png';
import LessonsIcon from './assets/lessons.png';
import ActivityIcon from './assets/activity.png';
import MoreInfoIcon from './assets/more-info.png';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let icon;

            // Use your custom icons based on the route name
            if (route.name === 'Home') {
              icon = HomeIcon;
            } else if (route.name === 'Lessons') {
              icon = LessonsIcon;
            } else if (route.name === 'Activity') {
              icon = ActivityIcon;
            } else if (route.name === 'More Info') {
              icon = MoreInfoIcon;
            }

            // Return the custom icon
            return (
              <Image
                source={icon}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#003366' : 'gray', // Change color when focused
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
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Lessons" component={() => null} />
        <Tab.Screen name="Activity" component={() => null} />
        <Tab.Screen name="More Info" component={() => null} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
