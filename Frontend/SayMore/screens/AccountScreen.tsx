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

export default function AccountScreen() {
  const navigation = useNavigation();

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

  const borderInterpolation = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2D336B', '#7886C7'],
  });

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
            <Text style={styles.username}>
              {userData?.username || 'Username'}
            </Text>
            <Text style={styles.nameText}>
              {userData?.fname} {userData?.sname}
            </Text>
          </>
        )}

        <View style={styles.menuContainer}>
          {['Account Details', 'Settings'].map((item, index) => (
            <Animated.View
              key={index}
              style={[
                styles.animatedBorder,
                { borderColor: borderInterpolation },
              ]}>
              <LinearGradient
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
                  }}>
                  <Text style={styles.menuText}>{item}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
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
    paddingVertical: 45,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },

  avatarWrapper: {
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

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2D57',
    marginBottom: 6,
  },

  nameText: {
    fontSize: 15,
    color: '#2A2D57',
    marginBottom: 28,
  },

  menuContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },

  animatedBorder: {
    borderWidth: 2.5,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
  },

  menuItemWrapper: {
    borderRadius: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },

  menuItem: {
    paddingVertical: 16,
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
