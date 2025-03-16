import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

const QuizzesNavScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateToPublicSpeaking = () => {
    navigation.navigate('Difficulty', { type: 'PublicSpeaking' }); // Public Speaking goes to Difficulty screen
  };

  const navigateToStuttering = () => {
    // Directly navigate to StutteringQuestionScreen with the default set_name
    navigation.navigate('StutteringQuestionScreen', { set_name: 'relaxation techniques' });
  };

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']}
      style={styles.container}
    >
      <Text style={styles.title}>Quizzes And Challenges</Text>
      <View style={styles.card}>
        <Image
          source={require('../assets/quiznav.jpg')}
          style={styles.image}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToPublicSpeaking}
          >
            <Text style={styles.buttonText}>Public Speaking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={navigateToStuttering}
          >
            <Text style={styles.buttonText}>Stuttering</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  image: {
    width: 250,
    height: 150,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2A2D57',
  },
});

export default QuizzesNavScreen;
