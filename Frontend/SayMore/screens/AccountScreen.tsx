import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTheme } from '../components/ThemeContext';

export default function AccountScreen() {
  const theme = useTheme();

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (googleError) {
      console.log('Google sign out error:', googleError);
    }
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while signing out. Please try again.'
      );
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: handleSignOut, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={theme === 'dark' ? styles.darkSidebar : styles.lightSidebar}>
        <Image source={require('../assets/avatar.png')} style={styles.avatar} />
        <Text style={theme === 'dark' ? styles.darkUsername : styles.lightUsername}>Aria Davis</Text>
        {[
          'Activity',
          'Quizzes and Challenges',
          'Progress',
          'Points',
          'Leaderboard',
          'Speech Therapy',
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={
              item === 'Progress' ? styles.menuItemActive : styles.menuItem
            }>
            <Text
              style={
                item === 'Progress' ? styles.menuTextActive : (theme === 'dark' ? styles.darkMenuText : styles.lightMenuText)
              }>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmSignOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkContainer: { flex: 1, backgroundColor: '#000000', padding: 20 },
  lightContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  lightSidebar: {
    width: '75%',
    height: '100%',
    backgroundColor: '#BDE0FE',
    padding: 20,
    alignItems: 'flex-start',
  },
  darkSidebar: {
    width: '75%',
    height: '100%',
    backgroundColor: '#333333',
    padding: 20,
    alignItems: 'flex-start',
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  lightUsername: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },
  darkUsername: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  menuItem: { paddingVertical: 10 },
  lightMenuText: { fontSize: 16, color: '#003366' },
  darkMenuText: { fontSize: 16, color: '#FFFFFF' },
  menuItemActive: {
    paddingVertical: 10,
    backgroundColor: '#0080FF',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  menuTextActive: { fontSize: 16, color: '#FFFFFF' },
  logoutButton: { marginTop: 20 },
  logoutText: { fontSize: 16, color: '#FF0000' },
});