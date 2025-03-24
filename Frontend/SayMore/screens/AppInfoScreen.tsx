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

/**
 * AppInfoScreen component that displays information about the app.
 * @returns {JSX.Element} The rendered component.
 */
const AppInfoScreen = () => {
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
        <Text style={styles.headerText}>App Information</Text>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.contentWrapper}>
        <LinearGradient
          colors={
            theme === 'dark' ? ['#1a1a1a', '#1a1a1a'] : ['#F9FAFC', '#ECEFF9']
          }
          style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.title, theme === 'dark' && styles.darkTitle]}>
              SayMore App
            </Text>
            <Text
              style={[styles.subText, theme === 'dark' && styles.darkSubText]}>
              Version: 1.0.0
            </Text>

            <Text
              style={[
                styles.sectionHeader,
                theme === 'dark' && styles.darkSectionHeader,
              ]}>
              Overview
            </Text>
            <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
              SayMore is your personal companion for improving public speaking
              and speech fluency. Whether you're looking to overcome stuttering,
              refine your pronunciation, or build confidence in front of an
              audience, SayMore offers personalized exercises, audio analysis,
              and progress tracking features.
            </Text>

            <Text
              style={[
                styles.sectionHeader,
                theme === 'dark' && styles.darkSectionHeader,
              ]}>
              Features
            </Text>
            <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
              - Public Speaking Practice{'\n'}- Stuttering Assistance Exercises
              {'\n'}- Personalized Audio Feedback{'\n'}- Progress Analysis and
              Metrics{'\n'}- Customizable User Profile
            </Text>

            <Text
              style={[
                styles.sectionHeader,
                theme === 'dark' && styles.darkSectionHeader,
              ]}>
              Developer
            </Text>
            <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
              Developed by SayMore Team{'\n'}
              For support or inquiries:{'\n'}
              Email: support@saymoreapp.com
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
  container: { flex: 1, paddingTop: 50 },

  headerBar: {
    paddingHorizontal: 25,
    marginBottom: 18,
    alignItems: 'center',
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  headerUnderline: {
    marginTop: 6,
    width: 210,
    height: 3,
    backgroundColor: '#D0D3E6',
    borderRadius: 2,
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
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

  scrollContent: { padding: 25 },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2A2D57',
  },

  darkTitle: {
    color: '#FFFFFF',
  },

  subText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#3B5998',
  },

  darkSubText: {
    color: '#CCCCCC',
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
    color: '#3B5998',
  },

  darkSectionHeader: {
    color: '#FFFFFF',
  },

  text: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2A2D57',
  },

  darkText: {
    color: '#FFFFFF',
  },

  backButton: {
    marginTop: 20,
    marginBottom: 15,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 7,
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

export default AppInfoScreen;