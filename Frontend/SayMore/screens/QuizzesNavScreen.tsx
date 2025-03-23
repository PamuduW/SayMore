import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
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

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#8AAEE0']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>

      {/* Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={[
            styles.backButton,
            theme === 'dark' ? styles.backButtonDark : styles.backButtonLight,
          ]}>
          <Text
            style={[
              styles.backButtonText,
              theme === 'dark' && styles.backButtonTextDark,
            ]}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quizzes and Challenges</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.cardsWrapper}
        showsVerticalScrollIndicator={false}>
        {/* Public Speaking Card */}
        <View style={[styles.card, theme === 'dark' && styles.cardDark]}>
          <View
            style={[
              styles.imageWrapper,
              theme === 'dark' && styles.imageWrapperDark,
            ]}>
            <Image
              source={require('../assets/quiznav.jpg')}
              style={styles.image}
            />
          </View>
          <Text
            style={[
              styles.cardTitle,
              theme === 'dark' && styles.cardTitleDark,
            ]}>
            Public Speaking
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={navigateToPublicSpeaking}>
            <LinearGradient
              colors={
                theme === 'dark'
                  ? ['#4A4A4A', '#6B6B6B']
                  : ['#3B5998', '#577BC1']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stuttering Card */}
        <View style={[styles.card, theme === 'dark' && styles.cardDark]}>
          <View
            style={[
              styles.imageWrapper,
              theme === 'dark' && styles.imageWrapperDark,
            ]}>
            <Image
              source={require('../assets/stutterquiz.png')}
              style={styles.image}
            />
          </View>
          <Text
            style={[
              styles.cardTitle,
              theme === 'dark' && styles.cardTitleDark,
            ]}>
            Stuttering
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={navigateToStuttering}>
            <LinearGradient
              colors={
                theme === 'dark'
                  ? ['#4A4A4A', '#6B6B6B']
                  : ['#3B5998', '#577BC1']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginRight: 10,
  },
  backButtonLight: {
    backgroundColor: '#E6F7FF',
  },
  backButtonDark: {
    backgroundColor: '#FFF',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    includeFontPadding: false,
    paddingBottom: 2,
    lineHeight: 32,
  },
  backButtonTextDark: {
    color: '#000',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardsWrapper: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    width: '95%',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  cardDark: {
    backgroundColor: '#2B2B2B',
  },
  imageWrapper: {
    backgroundColor: '#F9FAFC',
    padding: 12,
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  imageWrapperDark: {
    backgroundColor: '#1C1C1C',
  },
  image: {
    width: 230,
    height: 140,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2D57',
    marginBottom: 20,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  button: {
    width: '75%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 12,
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});

export default QuizzesNavScreen;
