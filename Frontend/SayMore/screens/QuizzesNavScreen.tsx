import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

const QuizzesNavScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateToPublicSpeaking = () => {
    navigation.navigate('Difficulty', { type: 'PublicSpeaking' });
  };

  const navigateToStuttering = () => {
    navigation.navigate('StutteringQuestionScreen', {
      set_name: 'relaxation techniques',
    });
  };

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']}
      style={styles.container}>

      <Text style={styles.title}>Quizzes & Challenges</Text>

      {/* Public Speaking Card */}
      <View style={styles.card}>
        <Image source={require('../assets/quiznav.jpg')} style={styles.image} />
        <Text style={styles.cardTitle}>Public Speaking</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToPublicSpeaking}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>

      {/* Stuttering Card */}
      <View style={styles.card}>
        <Image source={require('../assets/stutterquiz.png')} style={styles.image} />
        <Text style={styles.cardTitle}>Stuttering</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToStuttering}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: 250,
    height: 150,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2D57',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3B5998',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default QuizzesNavScreen;
