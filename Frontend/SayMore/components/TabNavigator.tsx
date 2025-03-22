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
import ActivityScreen from '../screens/ActivityScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import VideoListScreen from '../screens/VideoListScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FeedbackScreen_PS from '../screens/FeedbackScreen_PS';
import FeedbackScreen_S from '../screens/FeedbackScreen_S';
import SpeechTherapyScreen from '../screens/SpeechTherapyScreen';
import AdditionalDetailsScreen from '../screens/AdditionalDetailsScreen';
import Difficulty from '../screens/Difficulty';
import PublicSpeakQuestionScreen from '../screens/PublicSpeakQuestionScreen';
import StutteringQuestionScreen from '../screens/StutteringQuestionScreen';
import PointsScreen from '../screens/PointsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import QuizzesNavScreen from '../screens/QuizzesNavScreen';
import HomeIcon from '../assets/home.png';
import MoreInfoIcon from '../assets/more-info.png';
import UserAccIcon from '../assets/useracc.png';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';
import PrivacyCookiesScreen from '../screens/PrivacyCookiesScreen';
import AppInfoScreen from '../screens/AppInfoScreen';
import LessonsPointsScreen from '../screens/LessonsPointsScreen';
// Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Audio" component={AudioScreen} />
    <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
    <Stack.Screen name="FeedbackScreen_PS" component={FeedbackScreen_PS} />
    <Stack.Screen name="FeedbackScreen_S" component={FeedbackScreen_S} />
    <Stack.Screen
      name="AdditionalDetailsScreen"
      component={AdditionalDetailsScreen}
    />
  </Stack.Navigator>
);

// More Stack
const MoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreScreen" component={MoreScreen} />
    <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
    <Stack.Screen name="Lessons" component={LessonsScreen} />
    <Stack.Screen name="VideoList" component={VideoListScreen} />
    <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    <Stack.Screen name="LessonsPointsScreen" component={LessonsPointsScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="QuizzesNavScreen" component={QuizzesNavScreen} />
    <Stack.Screen name="Difficulty" component={Difficulty} />
    <Stack.Screen
      name="PublicSpeakQuestionScreen"
      component={PublicSpeakQuestionScreen}
    />
    <Stack.Screen
      name="StutteringQuestionScreen"
      component={StutteringQuestionScreen}
    />
    <Stack.Screen name="PointsScreen" component={PointsScreen} />
    <Stack.Screen name="SpeechTherapyScreen" component={SpeechTherapyScreen} />
  </Stack.Navigator>
);

// Account Stack
const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountScreen" component={AccountScreen} />
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen
      name="ChangePasswordScreen"
      component={ChangePasswordScreen}
    />
    <Stack.Screen
      name="TermsAndConditionsScreen"
      component={TermsAndConditionsScreen}
    />
    <Stack.Screen
      name="PrivacyCookiesScreen"
      component={PrivacyCookiesScreen}
    />
    <Stack.Screen name="AppInfoScreen" component={AppInfoScreen} />
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Audio" component={AudioScreen} />
    <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
    <Stack.Screen name="FeedbackScreen_PS" component={FeedbackScreen_PS} />
    <Stack.Screen name="FeedbackScreen_S" component={FeedbackScreen_S} />
    <Stack.Screen
      name="AdditionalDetailsScreen"
      component={AdditionalDetailsScreen}
    />
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
        style={[
          styles.icon,
          focused
            ? theme === 'dark'
              ? styles.darkActiveIcon
              : styles.lightActiveIcon
            : styles.inactiveIcon,
        ]}
      />
    ),
    tabBarActiveTintColor: theme === 'dark' ? '#FFFFFF' : '#003366',
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
  lightActiveIcon: {
    tintColor: '#003366',
  },
  darkActiveIcon: {
    tintColor: '#FFFFFF',
  },
  inactiveIcon: {
    tintColor: 'gray',
  },
});

export default TabNavigator;
