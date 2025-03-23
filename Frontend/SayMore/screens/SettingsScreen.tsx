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

  const handleBackPress = () => {
    navigation.goBack();
  };

  const preferences = [
    { label: 'Notifications', toggle: 'notifications', icon: NotificationIcon },
    { label: 'Dark Mode', toggle: 'darkmode', icon: DarkModeIcon },
  ];

  const info = [
    { label: 'Privacy & Cookies', icon: CookiesIcon, screen: 'PrivacyCookiesScreen' },
    { label: 'Terms & Conditions', icon: ConditionsIcon, screen: 'TermsAndConditionsScreen' },
    { label: 'App Info', icon: AppInfoIcon, screen: 'AppInfoScreen' },
  ];

  const renderOption = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.option,
        theme === 'dark' ? styles.optionDark : styles.optionLight,
      ]}
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}>
      <View style={styles.leftSection}>
        <View style={[
          styles.iconContainer,
          theme === 'dark' ? styles.iconContainerDark : styles.iconContainerLight
        ]}>
          <Image
            source={item.icon}
            style={[
              styles.optionIcon,
              theme === 'dark' ? styles.iconDark : styles.iconLight,
            ]}
          />
        </View>
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
          trackColor={{ false: '#E1E1E1', true: theme === 'dark' ? '#3F51B5' : '#577BC1' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#E1E1E1"
          style={styles.switch}
        />
      )}

      {item.toggle === 'darkmode' && (
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#E1E1E1', true: theme === 'dark' ? '#3F51B5' : '#577BC1' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#E1E1E1"
          style={styles.switch}
        />
      )}

      {!item.toggle && (
        <View style={styles.arrowContainer}>
          <Text style={[styles.arrow, theme === 'dark' ? styles.arrowDark : styles.arrowLight]}>→</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={
        theme === 'dark'
          ? ['#121212', '#252525']
          : ['#577BC1', '#8EA7E9']
      }
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme === 'dark' ? '#121212' : '#577BC1'} />

      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={[
            styles.backButton,
            theme === 'dark' ? styles.backButtonDark : styles.backButtonLight,
          ]}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Settings</Text>

        <View style={styles.headerIconContainer}>
          <Image
            source={SettingsIcon}
            style={[styles.headerIconRight, styles.headerIconTint]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.sectionContainer,
            theme === 'dark' ? styles.sectionDark : styles.sectionLight,
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              theme === 'dark'
                ? styles.sectionTitleDark
                : styles.sectionTitleLight,
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
              theme === 'dark'
                ? styles.sectionTitleDark
                : styles.sectionTitleLight,
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
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 50
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
    letterSpacing: 0.5,
  },

  headerIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 28,
    padding: 22,
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  sectionLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  sectionDark: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
  },

  sectionTitle: {
    fontSize: 22,
    marginBottom: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 14,
  },

  optionLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  optionDark: {
    backgroundColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  iconContainerLight: {
    backgroundColor: 'rgba(87, 123, 193, 0.1)',
  },

  iconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  optionIcon: {
    width: 22,
    height: 22,
  },

  iconLight: {
    tintColor: '#577BC1',
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
  optionTextDark: {
    color: '#FFFFFF',
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  backButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },

  headerIconTint: {
    tintColor: '#FFFFFF',
  },

  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },

  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  arrowLight: {
    color: '#577BC1',
  },

  arrowDark: {
    color: '#AAAAAA',
  },
});
