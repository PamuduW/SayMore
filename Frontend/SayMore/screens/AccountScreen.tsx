import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function AccountScreen() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <LinearGradient colors={['#2A2D57', '#577BC1']} style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.avatarWrapper}
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
            <Text style={styles.username}>
              {userData?.username || 'Username'}
            </Text>

            {/* Full Name Display */}
            <Text style={styles.nameText}>
              {userData?.fname} {userData?.sname}
            </Text>
          </>
        )}

        <View style={styles.menuContainer}>
          {[
            'Account Details',
            'Activity',
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
                  if (item === 'Account Details') {
                    navigation.navigate('EditProfileScreen', { userData });
                  }
                  if (item === 'Activity') {
                    navigation.navigate('ActivityScreen'); // ✅ Navigate to ActivityScreen
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  avatar: { width: 80, height: 80, borderRadius: 40 },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2D57',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 14,
    color: '#2A2D57',
    marginBottom: 25,
  },
  menuContainer: { width: '100%', alignItems: 'center', marginBottom: 25 },
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
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
