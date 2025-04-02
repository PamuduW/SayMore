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
import { useTheme } from '../components/ThemeContext'; // Import the theme context
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
  const navigation = useNavigation(); // Navigation hook for moving between screens
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function from context
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // State to manage notification toggle

  // Run once when the component mounts to check notification permissions
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  // Check if the user has granted notification permissions
  const checkNotificationPermission = async () => {
    const authStatus = await messaging().hasPermission();
    setNotificationsEnabled(
      authStatus === messaging.AuthorizationStatus.AUTHORIZED
    );
  };

  // Toggle notifications on or off
  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      // Disable notifications
      await messaging().deleteToken();
      setNotificationsEnabled(false);
    } else {
      // Request permission for notifications if not granted
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
      const authStatus = await messaging().requestPermission();
      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        await messaging().getToken(); // Get new token if enabled
        setNotificationsEnabled(true);
      }
    }
  };

  // Navigate back to the previous screen
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Define preference settings options
  const preferences = [
    { label: 'Notifications', toggle: 'notifications', icon: NotificationIcon },
    { label: 'Dark Mode', toggle: 'darkmode', icon: DarkModeIcon },
  ];

  // Define informational settings options
  const info = [
    { label: 'Privacy & Cookies', icon: CookiesIcon, screen: 'PrivacyCookiesScreen' },
    { label: 'Terms & Conditions', icon: ConditionsIcon, screen: 'TermsAndConditionsScreen' },
    { label: 'App Info', icon: AppInfoIcon, screen: 'AppInfoScreen' },
  ];

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#121212', '#252525'] : ['#577BC1', '#8EA7E9']}
      style={styles.container}>

      {/* Status bar to match theme */}
      <StatusBar barStyle="light-content" backgroundColor={theme === 'dark' ? '#121212' : '#577BC1'} />

      {/* Header section */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
        <Image source={SettingsIcon} style={styles.headerIcon} />
      </View>

      {/* Scrollable content area */}
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>

        {/* Preferences Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {preferences.map((item, index) => (
            <TouchableOpacity key={index} style={styles.option}>
              <View style={styles.leftSection}>
                <Image source={item.icon} style={styles.optionIcon} />
                <Text style={styles.optionText}>{item.label}</Text>
              </View>

              {/* Toggle Switch for Preferences */}
              {item.toggle === 'notifications' && (
                <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
              )}
              {item.toggle === 'darkmode' && (
                <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Information</Text>
          {info.map((item, index) => (
            <TouchableOpacity key={index} style={styles.option} onPress={() => navigation.navigate(item.screen)}>
              <View style={styles.leftSection}>
                <Image source={item.icon} style={styles.optionIcon} />
                <Text style={styles.optionText}>{item.label}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Styles for the settings screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionContainer: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 18,
    fontWeight: '700',
    color: '#2A2D57',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 14,
    backgroundColor: '#F7F7F7',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 22,
    height: 22,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2D57',
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#577BC1',
  },
});