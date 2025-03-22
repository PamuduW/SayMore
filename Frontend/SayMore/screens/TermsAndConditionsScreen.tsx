import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
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
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Terms & Conditions</Text>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>Last Updated: 16/02/2025</Text>
        </View>

        <ScrollView
          style={[
            styles.scrollContainer,
            theme === 'dark' && styles.darkScrollContainer,
          ]}
          contentContainerStyle={styles.scrollContent}>
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
            progress metrics, for personalized feedback and service improvement.
            Your data will be handled in accordance with our Privacy Policy.
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
    marginBottom: 20,
    alignItems: 'center',
  },

  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  headerUnderline: {
    marginTop: 6,
    width: 230,
    height: 3,
    backgroundColor: '#D0D3E6',
    borderRadius: 2,
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },

  dateContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },

  date: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  scrollContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  darkScrollContainer: {
    backgroundColor: '#1a1a1a',
  },

  scrollContent: {
    padding: 25,
  },

  text: {
    fontSize: 16,
    color: '#2A2D57',
    lineHeight: 26,
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
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#3B5998',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
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
