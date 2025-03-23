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
import TotalPointsScreen from '../screens/TotalPointsScreen';
import PointsCategoryScreen from '../screens/PointsCategoryScreen';
import QuizPointHistoryScreen from '../screens/QuizPointHistoryScreen';
import LessonRedirectionStuttering from '../screens/LessonRedirectionStuttering';
import UnderstandingAndOvercomingStutteringScreen from '../screens/UnderstandingAndOvercomingStutteringScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LessonRedirectionPS from '../screens/LessonRedirectionPS';
import CommunicationAndStageFrightScreen from '../screens/CommunicationAndStageFrightScreen';
import ClarityAndPitchScreen from '../screens/ClarityAndPitchScreen';
import SpeakingWithEnergyScreen from '../screens/SpeakingWithEnergyScreen';
import TestHistory from '../screens/TestHistory';
import TestHistory_PS from '../screens/TestHistory_PS';

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack - The stack navigator for the "Home" section, includes all the screens related to Home.
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
    {/* Moved UnderstandingAndOvercomingStuttering to HomeStack to match desired structure */}
    <Stack.Screen
      name="UnderstandingAndOvercomingStutteringScreen"
      component={UnderstandingAndOvercomingStutteringScreen}
    />
    <Stack.Screen
      name="LessonRedirectionStuttering"
      component={LessonRedirectionStuttering}
    />
    <Stack.Screen
      name="ClarityAndPitchScreen"
      component={ClarityAndPitchScreen}
    />
    <Stack.Screen
      name="CommunicationAndStageFrightScreen"
      component={CommunicationAndStageFrightScreen}
    />
    <Stack.Screen
      name="SpeakingWithEnergyScreen"
      component={SpeakingWithEnergyScreen}
    />
    <Stack.Screen name="LessonRedirectionPS" component={LessonRedirectionPS} />
  </Stack.Navigator>
);

// More Stack - The stack navigator for the "More" section, includes all the screens related to lessons, quizzes, and history.
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
    <Stack.Screen
      name="PointsCategoryScreen"
      component={PointsCategoryScreen}
    />
    <Stack.Screen name="TotalPointsScreen" component={TotalPointsScreen} />
    <Stack.Screen
      name="QuizPointHistoryScreen"
      component={QuizPointHistoryScreen}
    />
    <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
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
    <Stack.Screen
      name="LessonRedirectionStuttering"
      component={LessonRedirectionStuttering}
    />
    <Stack.Screen name="TestHistory" component={TestHistory} />
    <Stack.Screen name="TestHistory_PS" component={TestHistory_PS} />
  </Stack.Navigator>
);

// Account Stack - The stack navigator for the "Account" section, includes screens related to user settings, profile, and security.
const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountScreen" component={AccountScreen} />
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
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
  </Stack.Navigator>
);

// Tab Options - Function to set the appearance and behavior of the tab bar based on the theme.
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
    tabBarActiveTintColor: theme === 'dark' ? '#FFFFFF' : '#003366', // Adjusting the active tab icon color based on the theme.
    tabBarInactiveTintColor: 'gray', // Default color for inactive tabs.
    tabBarStyle: {
      backgroundColor: theme === 'dark' ? '#333333' : '#F0F8FF', // Tab bar color based on the theme.
      borderTopWidth: 0,
      elevation: 0,
    },
    headerShown: false, // Hiding the header in the bottom tab bar screens.
  };
};

// Main Tab Navigator - The main bottom tab navigation structure combining all the screens.
const TabNavigator = () => {
  const theme = useTheme(); // Fetch current theme (light/dark)

  return (
    <Tab.Navigator screenOptions={({ route }) => screenOptions(route, theme)}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="More" component={MoreStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
};

// Styles - Styling for the icons and tab bar.
const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
  activeIcon: {
    tintColor: '#003366', // Active icon color (default theme).
  },
  lightActiveIcon: {
    tintColor: '#003366', // Active icon color for light theme.
  },
  darkActiveIcon: {
    tintColor: '#FFFFFF', // Active icon color for dark theme.
  },
  inactiveIcon: {
    tintColor: 'gray', // Inactive icon color.
  },
});

export default TabNavigator;
