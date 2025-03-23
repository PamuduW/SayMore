import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNotifications } from '../components/Notifications';
import { NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  useNotifications();
  const theme = useTheme();

  const [userData, setUserData] = useState(null);
  const borderAnimation = useRef(new Animated.Value(0)).current;

  // Fetch user data (only first name)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
      }
    };

    fetchUserData();
  }, []);

  // Animation
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
    outputRange:
      theme === 'dark' ? ['#FFFFFF', '#AAAAAA'] : ['#2D336B', '#7886C7'],
  });

  const handlePress = (option: string) => {
    const isPublicSpeaking = option === 'Public Speaking';
    navigation.navigate('Audio', { isPublicSpeaking });
  };

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#000000', '#222222'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.icon} source={require('../assets/iconTop.png')} />

        <Text style={styles.greeting}>
          Hello {userData?.fname ? userData.fname : ''},
        </Text>
        <Text style={styles.welcomeMessage}>Welcome to SayMore!</Text>
        <Text
          style={[
            styles.tagline,
            { color: theme === 'dark' ? '#DDDDDD' : '#D0D3E6' },
          ]}>
          Enhance your speech & confidence
        </Text>
      </View>

      <View
        style={[
          styles.testContainer,
          { backgroundColor: theme === 'dark' ? '#333333' : '#FFFFFF' },
        ]}>
        <Text
          style={[
            styles.testHeading,
            { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
          ]}>
          Start Your Test
        </Text>
        <Image
          style={styles.testImage}
          source={require('../assets/public-speaking.png')}
        />

        <View style={styles.testOptions}>
          {['Public Speaking', 'Stuttering'].map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handlePress(option)}>
              <Animated.View
                style={[
                  styles.optionButtonWrapper,
                  { borderColor: borderInterpolation },
                ]}>
                <LinearGradient
                  colors={
                    theme === 'dark'
                      ? ['#000000', '#222222']
                      : ['#3B5998', '#577BC1']
                  }
                  style={styles.optionButton}>
                  <Text style={styles.optionText}>{option}</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },

  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  icon: { width: 80, height: 80, marginBottom: 10 },

  greeting: {
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeMessage: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
  },

  testContainer: {
    alignItems: 'center',
    borderRadius: 25,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },

  testHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  testImage: { width: 220, height: 220, marginBottom: 25 },

  testOptions: { flexDirection: 'row', justifyContent: 'center', gap: 15 },

  optionButtonWrapper: {
    borderWidth: 3,
    borderRadius: 20,
    overflow: 'hidden',
  },

  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 150,
    height: 50,
  },

  optionText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});

export default HomeScreen;
