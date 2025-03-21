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
import { useTheme } from '../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

// Import icons
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
      style={[
        styles.option,
        theme === 'dark' ? styles.optionDark : styles.optionLight,
      ]}
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
        <Image
          source={
            item.label === 'Notifications'
              ? NotificationIcon
              : item.label === 'Dark Mode'
              ? DarkModeIcon
              : item.label === 'Terms & Conditions'
              ? ConditionsIcon
              : item.label === 'Privacy & Cookies'
              ? CookiesIcon
              : AppInfoIcon
          }
          style={[
            styles.optionIcon,
            theme === 'dark' ? styles.iconDark : styles.iconLight,
          ]}
        />
        <Text
          style={[
            styles.optionText,
            theme === 'dark' ? styles.optionTextDark : styles.optionTextLight,
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
        theme === 'dark' ? ['#000000', '#1C1C1C'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBar}>
        <Text style={styles.header}>Settings</Text>
        <Image
          source={SettingsIcon}
          style={[
            styles.headerIconRight,
            { tintColor: '#FFFFFF' },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View
          style={[
            styles.sectionContainer,
            theme === 'dark' ? styles.sectionDark : styles.sectionLight,
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              theme === 'dark' ? styles.sectionTitleDark : styles.sectionTitleLight,
            ]}>
            Preferences
          </Text>
          {preferences.map(renderOption)}
        </View>

        <View
          style={[
            styles.sectionContainer,
            theme === 'dark' ? styles.sectionDark : styles.sectionLight,
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              theme === 'dark' ? styles.sectionTitleDark : styles.sectionTitleLight,
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
  },

  sectionLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionDark: {
    backgroundColor: '#1C1C1C',
    shadowColor: 'transparent',
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '700',
  },
  sectionTitleLight: {
    color: '#2A2D57',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 12,
  },

  optionLight: {
    backgroundColor: '#F7F9FC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  optionDark: {
    backgroundColor: '#2B2B2B',
    shadowColor: 'transparent',
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
    fontWeight: '500',
  },

  optionTextLight: {
    color: '#2A2D57',
  },
  optionTextDark: {
    color: '#FFFFFF',
  },
});
