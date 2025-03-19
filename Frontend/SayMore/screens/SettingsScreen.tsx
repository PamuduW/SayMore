import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons'; // NEW IMPORT!
import { useTheme } from '../components/ThemeContext';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useTheme();

  const preferences = [
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'moon-outline', label: 'Dark Mode', toggle: true },
  ];

  const info = [
    { icon: 'lock-closed-outline', label: 'Privacy & Cookies' },
    { icon: 'document-text-outline', label: 'Terms & Conditions' },
    { icon: 'information-circle-outline', label: 'App Info' },
  ];

  const renderOption = (item, index) => (
    <TouchableOpacity key={index} style={styles.option}>
      <View style={styles.leftSection}>
        <Ionicons
          name={item.icon}
          size={22}
          color="#FFFFFF"
          style={{ marginRight: 12 }}
        />
        <Text style={styles.optionText}>{item.label}</Text>
      </View>

      {item.toggle ? (
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#D0D3E6', true: '#3B5998' }}
          thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward-outline" size={20} color="#FFFFFF" />
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

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.header}>Settings</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        {preferences.map(renderOption)}

        {/* Info Section */}
        <Text style={styles.sectionTitle}>Information</Text>
        {info.map(renderOption)}
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

  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 10,
  },

  scrollArea: {
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    color: '#D0D3E6',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#7886C7',
    borderBottomWidth: 0.5,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
