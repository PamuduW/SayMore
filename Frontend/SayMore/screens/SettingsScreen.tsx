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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Check initial notification permission
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const authStatus = await messaging().hasPermission();
    setNotificationsEnabled(authStatus === messaging.AuthorizationStatus.AUTHORIZED);
  };

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      // Disable: unsubscribe from FCM
      await messaging().deleteToken();
      setNotificationsEnabled(false);
    } else {
      // Enable: request permission & get token
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
      style={styles.option}
      onPress={() => {
        if (item.label === 'Terms & Conditions') {
          navigation.navigate('TermsAndConditionsScreen');
        } else if (item.label === 'Privacy & Cookies') {
          navigation.navigate('PrivacyCookiesScreen');
        } else if (item.label === 'App Info') {
          navigation.navigate('AppInfoScreen');
        }
      }}
    >
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
        <Text style={styles.optionText}>{item.label}</Text>
      </View>

      {item.toggle === 'notifications' && (
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#D0D3E6', true: '#3B5998' }}
          thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
        />
      )}

      {item.toggle === 'darkmode' && (
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#D0D3E6', true: '#3B5998' }}
          thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#2A2D57', '#577BC1']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBar}>
        <Text style={styles.header}>Settings</Text>
        <Image source={SettingsIcon} style={styles.headerIconRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {preferences.map(renderOption)}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Information</Text>
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
    tintColor: '#FFFFFF',
  },

  scrollArea: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  sectionTitle: {
    fontSize: 18,
    color: '#2A2D57',
    marginBottom: 15,
    fontWeight: '700',
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionIcon: {
    width: 22,
    height: 22,
    tintColor: '#3B5998',
    marginRight: 12,
  },

  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A2D57',
  },
});
