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

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']
      }
      style={styles.container}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'light-content'}
      />

      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Terms & Conditions</Text>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>Last Updated: 16/02/2025</Text>
        </View>

        <LinearGradient
          colors={
            theme === 'dark' ? ['#1a1a1a', '#1a1a1a'] : ['#F9FAFC', '#ECEFF9']
          }
          style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
              By using SayMore, you agree to the following:
              {'\n\n'}
              1.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Account Information:
              </Text>{' '}
              Provide accurate and truthful personal information during
              registration and ensure your account remains secure.
              {'\n\n'}
              2.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                App Usage:
              </Text>{' '}
              Use the app solely for personal speech improvement and not as a
              substitute for professional therapy, diagnosis, or advice.
              {'\n\n'}
              3.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Data Usage:
              </Text>{' '}
              Allow secure processing of your data, such as audio recordings and
              progress metrics, for personalized feedback and service
              improvement. Your data will be handled in accordance with our
              Privacy Policy.
              {'\n\n'}
              4.{' '}
              <Text
                style={[
                  styles.boldText,
                  theme === 'dark' && styles.darkBoldText,
                ]}>
                Prohibited Actions:
              </Text>{' '}
              Refrain from misuse of the app, including sharing inappropriate,
              offensive, or harmful content, attempting unauthorized access, or
              using the app for commercial purposes.
            </Text>
          </ScrollView>
        </LinearGradient>

        <TouchableOpacity
          style={[
            styles.backButton,
            theme === 'dark' ? styles.darkBackButton : styles.lightBackButton,
          ]}
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
    marginBottom: 15,
    alignItems: 'center',
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  headerUnderline: {
    marginTop: 6,
    width: 220,
    height: 3,
    backgroundColor: '#D0D3E6',
    borderRadius: 2,
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  dateContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  date: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  scrollContainer: {
    borderRadius: 25,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },

  scrollContent: {
    padding: 25,
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
    fontWeight: '700',
    color: '#FFFFFF',
  },

  backButton: {
    marginTop: 22,
    marginBottom: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  lightBackButton: {
    backgroundColor: '#3B5998',
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

export default TermsAndConditionsScreen;
