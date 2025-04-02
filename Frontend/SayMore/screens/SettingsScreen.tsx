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
import DropDownPicker from 'react-native-dropdown-picker';

import SettingsIcon from '../assets/settings.png';
import NotificationIcon from '../assets/notificationsset.png';
import DarkModeIcon from '../assets/darkmodeset.png';
import ConditionsIcon from '../assets/conditionsset.png';
import CookiesIcon from '../assets/cookieset.png';
import AppInfoIcon from '../assets/appinfoset.png';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(theme);

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

  const handleModeChange = (value) => {
    setMode(value);
    setTheme(value);
  };

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#121212', '#252525'] : ['#577BC1', '#8EA7E9']}
      style={styles.container}>

      <StatusBar barStyle="light-content" backgroundColor={theme === 'dark' ? '#121212' : '#577BC1'} />

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
        <Image source={SettingsIcon} style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.option}>
            <View style={styles.leftSection}>
              <Image source={NotificationIcon} style={styles.optionIcon} />
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
          </TouchableOpacity>

          <View style={styles.option}>
            <View style={styles.leftSection}>
              <Image source={DarkModeIcon} style={styles.optionIcon} />
              <Text style={styles.optionText}>Theme</Text>
            </View>
            <DropDownPicker
              open={open}
              value={mode}
              items={[
                { label: 'Light Mode', value: 'light' },
                { label: 'Dark Mode', value: 'dark' },
                { label: 'System Mode', value: 'system' },
              ]}
              setOpen={setOpen}
              setValue={setMode}
              onChangeValue={handleModeChange}
              containerStyle={{ width: 150 }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 50 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 25 },
  header: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, borderRadius: 20, marginBottom: 14, backgroundColor: '#F7F7F7' },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  optionIcon: { width: 22, height: 22, marginRight: 15 },
  optionText: { fontSize: 16, fontWeight: '600', color: '#2A2D57' },
});
