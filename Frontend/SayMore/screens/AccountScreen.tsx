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
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

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
    <LinearGradient
      colors={theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']}
      style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <Image source={require('../assets/avatar.png')} style={styles.avatar} />
        </View>

        <Text style={styles.username}>Aria Davis</Text>

        <View style={styles.menuContainer}>
          {[
            'Activity',
            'Quizzes and Challenges',
            'Progress',
            'Goals',
            'Leaderboard',
            'Settings',
          ].map((item, index) => (
            <LinearGradient
              key={index}
              colors={['#3B5998', '#577BC1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuItemWrapper}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (item === 'Settings') {
                    navigation.navigate('SettingsScreen');
                  }
                }}>
                <Text style={styles.menuText}>{item}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmSignOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 14,
  },

  avatarWrapper: {
    backgroundColor: '#F2F3F8',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2D57',
    marginBottom: 25,
  },

  menuContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
  },

  menuItemWrapper: {
    borderRadius: 20,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 100,
  },

  menuItem: {
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    borderRadius: 18,
    elevation: 100,

  },

  menuText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  logoutButton: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 22,
    backgroundColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
