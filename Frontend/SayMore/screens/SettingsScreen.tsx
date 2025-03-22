import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  StatusBar,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import SettingsIcon from '../assets/settings.png';
import NotificationIcon from '../assets/notificationsset.png';
import DarkModeIcon from '../assets/darkmodeset.png';
import ConditionsIcon from '../assets/conditionsset.png';
import CookiesIcon from '../assets/cookieset.png';
import AppInfoIcon from '../assets/appinfoset.png';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const authStatus = await messaging().hasPermission();
    setNotificationsEnabled(
      authStatus === messaging.AuthorizationStatus.AUTHORIZED
    );
  };

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      await messaging().deleteToken();
      setNotificationsEnabled(false);
    } else {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
      const authStatus = await messaging().requestPermission();
      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        await messaging().getToken();
        setNotificationsEnabled(true);
      }
    }
  };

  const preferences = [
    { label: 'Notifications', toggle: 'notifications' },
    { label: 'Dark Mode', toggle: 'darkmode' },
  ];

  const info = [
    { label: 'Privacy & Cookies' },
    { label: 'Terms & Conditions' },
    { label: 'App Info' },
  ];

  const renderOption = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.option, theme === 'dark' && styles.darkOption]}
      onPress={() => {
        if (item.label === 'Terms & Conditions') {
          navigation.navigate('TermsAndConditionsScreen');
        } else if (item.label === 'Privacy & Cookies') {
          navigation.navigate('PrivacyCookiesScreen');
        } else if (item.label === 'App Info') {
          navigation.navigate('AppInfoScreen');
        }
      }}>
      <View style={styles.leftSection}>
        {item.label === 'Notifications' && (
          <Image source={NotificationIcon} style={styles.optionIcon} />
        )}
        {item.label === 'Dark Mode' && (
          <Image source={DarkModeIcon} style={styles.optionIcon} />
        )}
        {item.label === 'Terms & Conditions' && (
          <Image source={ConditionsIcon} style={styles.optionIcon} />
        )}
        {item.label === 'Privacy & Cookies' && (
          <Image source={CookiesIcon} style={styles.optionIcon} />
        )}
        {item.label === 'App Info' && (
          <Image source={AppInfoIcon} style={styles.optionIcon} />
        )}
        <Text
          style={[
            styles.optionText,
            theme === 'dark' && styles.darkOptionText,
          ]}>
          {item.label}
        </Text>
      </View>

      {item.toggle === 'notifications' && (
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#777777', true: '#FFFFFF' }}
          thumbColor={notificationsEnabled ? '#FFFFFF' : '#444444'}
        />
      )}

      {item.toggle === 'darkmode' && (
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#777777', true: '#FFFFFF' }}
          thumbColor={isDarkMode ? '#FFFFFF' : '#444444'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBar}>
        <Text style={styles.header}>Settings</Text>
        <Image
          source={SettingsIcon}
          style={[styles.headerIconRight, { tintColor: '#FFFFFF' }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View
          style={[
            styles.sectionContainer,
            theme === 'dark' && styles.darkSectionContainer,
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              theme === 'dark' && styles.darkSectionTitle,
            ]}>
            Preferences
          </Text>
          {preferences.map(renderOption)}
        </View>

        <View
          style={[
            styles.sectionContainer,
            theme === 'dark' && styles.darkSectionContainer,
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              theme === 'dark' && styles.darkSectionTitle,
            ]}>
            Information
          </Text>
          {info.map(renderOption)}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },

  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 25,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  headerIconRight: {
    width: 28,
    height: 28,
  },

  scrollArea: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  sectionContainer: {
    borderRadius: 25,
    padding: 22,
    marginBottom: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  sectionLight: {
    backgroundColor: '#FFFFFF',
  },
  sectionDark: {
    backgroundColor: '#1C1C1C',
  },

  darkSectionContainer: {
    backgroundColor: '#1a1a1a',
  },

  sectionTitle: {
    fontSize: 22,
    marginBottom: 18,
    fontWeight: 'bold',
  },
  sectionTitleLight: {
    color: '#2A2D57',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },

  darkSectionTitle: {
    color: '#FFFFFF',
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 14,
  },

  optionLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  optionDark: {
    backgroundColor: '#2B2B2B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },

  darkOption: {
    backgroundColor: '#1a1a1a',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  iconLight: {
    tintColor: '#3B5998',
  },
  iconDark: {
    tintColor: '#FFFFFF',
  },

  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },

  optionTextLight: {
    color: '#2A2D57',
  },

  darkOptionText: {
    color: '#FFFFFF',
  },
});
