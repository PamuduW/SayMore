import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';

export default function AccountScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animation
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      })
    ).start();
  }, [borderAnimation]);

  const fetchUserData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      }
    } catch (error) {
      console.log('Error fetching user data: ', error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData(false);
    }, [])
  );

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while signing out.');
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
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <View style={theme === 'dark' ? styles.darkCard : styles.lightCard}>
        <TouchableOpacity
          style={
            theme === 'dark'
              ? styles.darkAvatarWrapper
              : styles.lightAvatarWrapper
          }
          onPress={() => {
            if (userData) {
              navigation.navigate('EditProfileScreen', { userData });
            }
          }}>
          <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#2A2D57" />
        ) : (
          <>
            {/* Username Display */}
            <Text
              style={
                theme === 'dark' ? styles.darkUsername : styles.lightUsername
              }>
              {userData?.username || 'Username'}
            </Text>

            {/* Full Name Display */}
            <Text
              style={
                theme === 'dark' ? styles.darkNameText : styles.lightNameText
              }>
              {userData?.fname} {userData?.sname}
            </Text>
          </>
        )}

        <View style={styles.menuContainer}>
          {['Account Details', 'Settings'].map((item, index) => (
            <LinearGradient
              key={index}
              colors={
                theme === 'dark'
                  ? ['#2B2B2B', '#2B2B2B']
                  : ['#577BC1', '#577BC1']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuItemWrapper}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (item === 'Settings') {
                    navigation.navigate('SettingsScreen');
                  }
                  if (item === 'Account Details') {
                    navigation.navigate('EditProfileScreen', { userData });
                  }
                }}>
                <Text style={styles.menuText}>{item}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>

        {/* Gradient Logout Button */}
        <LinearGradient
          colors={['#e74c3c', '#c0392b']}
          style={styles.logoutButtonWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={confirmSignOut}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lightCard: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 45,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  darkCard: {
    backgroundColor: '#4a4a4a',
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

  lightAvatarWrapper: {
    backgroundColor: '#F2F3F8',
    padding: 14,
    borderRadius: 60,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  darkAvatarWrapper: {
    backgroundColor: '#1C1C1C',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  lightUsername: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2D57',
    marginBottom: 6,
  },
  darkUsername: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 15,
    color: '#2A2D57',
    marginBottom: 28,
  },
  lightNameText: {
    fontSize: 14,
    color: '#2A2D57',
    marginBottom: 25,
  },
  darkNameText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 25,
  },
  menuContainer: { width: '100%', alignItems: 'center', marginBottom: 25 },
  menuItemWrapper: {
    borderRadius: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 15,
  },
  menuItem: {
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    borderRadius: 18,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },

  logoutButtonWrapper: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
    marginTop: 20,
  },

  logoutButton: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    borderRadius: 25,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
