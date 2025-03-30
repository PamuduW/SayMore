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
import TestHistory_S from '../screens/TestHistory_S';
import QuizProgressScreen from '../screens/QuizProgressScreen';
import ProgressCategoryScreen from '../screens/ProgressCategoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * HomeStack component that defines the stack navigator for the Home tab.
 * @returns {JSX.Element} The stack navigator for the Home tab.
 */
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

/**
 * MoreStack component that defines the stack navigator for the More tab.
 * @returns {JSX.Element} The stack navigator for the More tab.
 */
const MoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreScreen" component={MoreScreen} />
    <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
    <Stack.Screen name="Lessons" component={LessonsScreen} />
    <Stack.Screen name="VideoList" component={VideoListScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="QuizzesNavScreen" component={QuizzesNavScreen} />
    <Stack.Screen
      name="ProgressCategoryScreen"
      component={ProgressCategoryScreen}
    />
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
    <Stack.Screen name="QuizProgressScreen" component={QuizProgressScreen} />
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
    <Stack.Screen name="TestHistory" component={TestHistory} />
    <Stack.Screen name="TestHistory_PS" component={TestHistory_PS} />
    <Stack.Screen name="TestHistory_S" component={TestHistory_S} />
  </Stack.Navigator>
);

/**
 * AccountStack component that defines the stack navigator for the Account tab.
 * @returns {JSX.Element} The stack navigator for the Account tab.
 */
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

/**
 * TabNavigator component that defines the bottom tab navigator.
 * @returns {JSX.Element} The bottom tab navigator.
 */
const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigation" options={{ headerShown: false }} >
        {() => (
          <Tab.Navigator screenOptions={({ route }) => screenOptions(route, theme)}>
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="More" component={MoreStack} />
            <Tab.Screen name="Account" component={AccountStack} />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="LessonsPointsScreen" component={LessonsPointsScreen} />
    </Stack.Navigator>
  );
};

/**
 * Function to define screen options for the tab navigator.
 * @param {Object} route - The route object.
 * @param {string} theme - The current theme ('light' or 'dark').
 * @returns {Object} The screen options for the tab navigator.
 */
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

/**
 * Styles for the TabNavigator component.
 */
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