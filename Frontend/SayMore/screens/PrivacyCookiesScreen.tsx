import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

const PrivacyCookiesScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']
      }
      style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Privacy & Cookies</Text>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.date}> </Text>

        <LinearGradient
          colors={
            theme === 'dark' ? ['#1a1a1a', '#1a1a1a'] : ['#F9FAFC', '#ECEFF9']
          }
          style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
              Your privacy is essential to us at SayMore. Here's how we protect
              your data:
              {'\n\n'}
              1.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Personal Info:
              </Text>{' '}
              We gather only basic details like your name & email to personalize
              your progress.
              {'\n\n'}
              2.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Audio Storage:
              </Text>{' '}
              Any speech recordings remain securely stored and are used
              exclusively for analysis and feedback.
              {'\n\n'}
              3.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Cookies Usage:
              </Text>{' '}
              We utilize cookies to ensure app performance & enhance your user
              experience. You can disable them anytime via device settings.
              {'\n\n'}
              4.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Data Sharing:
              </Text>{' '}
              We never share or sell your personal data to third parties.
              {'\n\n'}
              5.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Security Measures:
              </Text>{' '}
              Your data is safeguarded with modern encryption & privacy
              standards.
            </Text>
          </ScrollView>
        </LinearGradient>

        <TouchableOpacity
          style={[styles.backButton, theme === 'dark' && styles.darkBackButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },

  headerBar: {
    paddingHorizontal: 25,
    alignItems: 'center',
    marginBottom: 10,
  },

  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  headerUnderline: {
    marginTop: 6,
    width: 198,
    height: 3,
    backgroundColor: '#D0D3E6',
    borderRadius: 2,
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D0D3E6',
    marginBottom: 15,
  },

  scrollContainer: {
    backgroundColor: '#ECEFF9',
    borderRadius: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },

  scrollContent: {
    padding: 24,
  },

  text: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2A2D57',
  },

  darkText: {
    color: '#FFFFFF',
  },

  boldText: {
    fontWeight: '700',
    color: '#3B5998',
  },

  darkBoldText: {
    color: '#FFFFFF',
  },

  backButton: {
    marginTop: 25,
    marginBottom: 15,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    backgroundColor: '#3B5998',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 7,
  },

  darkBackButton: {
    backgroundColor: '#1a1a1a',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrivacyCookiesScreen;
