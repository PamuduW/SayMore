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
import { useColorScheme } from 'react-native';

const AppInfoScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <LinearGradient
      colors={isDarkMode ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']}
      style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>App Information</Text>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView
          style={[
            styles.scrollContainer,
            isDarkMode ? styles.scrollContainerDark : styles.scrollContainerLight,
          ]}
          contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, isDarkMode ? styles.titleDark : styles.titleLight]}>
            SayMore App
          </Text>
          <Text style={[styles.subText, isDarkMode ? styles.subTextDark : styles.subTextLight]}>
            Version: 1.0.0
          </Text>

          <Text
            style={[
              styles.sectionHeader,
              isDarkMode ? styles.sectionHeaderDark : styles.sectionHeaderLight,
            ]}>
            Overview
          </Text>
          <Text style={[styles.text, isDarkMode ? styles.textDark : styles.textLight]}>
            SayMore is your personal companion for improving public speaking and
            speech fluency. Whether you're looking to overcome stuttering,
            refine your pronunciation, or build confidence in front of an
            audience, SayMore offers personalized exercises, audio analysis, and
            progress tracking features.
          </Text>

          <Text
            style={[
              styles.sectionHeader,
              isDarkMode ? styles.sectionHeaderDark : styles.sectionHeaderLight,
            ]}>
            Features
          </Text>
          <Text style={[styles.text, isDarkMode ? styles.textDark : styles.textLight]}>
            - Public Speaking Practice{'\n'}- Stuttering Assistance Exercises
            {'\n'}- Personalized Audio Feedback{'\n'}- Progress Analysis and
            Metrics{'\n'}- Customizable User Profile
          </Text>

          <Text
            style={[
              styles.sectionHeader,
              isDarkMode ? styles.sectionHeaderDark : styles.sectionHeaderLight,
            ]}>
            Developer
          </Text>
          <Text style={[styles.text, isDarkMode ? styles.textDark : styles.textLight]}>
            Developed by SayMore Team{'\n'}
            For support or inquiries:{'\n'}
            Email: support@saymoreapp.com
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.backButton,
            isDarkMode ? styles.backButtonDark : styles.backButtonLight,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  headerUnderline: {
    marginTop: 6,
    width: 210,
    height: 3,
    backgroundColor: '#D0D3E6',
    borderRadius: 2,
  },

  contentWrapper: { flex: 1, paddingHorizontal: 20 },

  scrollContainer: {
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 9,
  },
  scrollContainerLight: {
    backgroundColor: '#FFFFFF',
  },
  scrollContainerDark: {
    backgroundColor: '#2B2B2B',
  },

  scrollContent: { padding: 25 },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  titleLight: {
    color: '#2A2D57',
  },
  titleDark: {
    color: '#FFFFFF',
  },

  subText: {
    fontSize: 14,
    marginBottom: 20,
  },
  subTextLight: {
    color: '#3B5998',
  },
  subTextDark: {
    color: '#CCCCCC',
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
  },
  sectionHeaderLight: {
    color: '#3B5998',
  },
  sectionHeaderDark: {
    color: '#DDDDDD',
  },

  text: {
    fontSize: 15.5,
    lineHeight: 24,
  },
  textLight: {
    color: '#2A2D57',
  },
  textDark: {
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
  backButtonLight: {
    backgroundColor: '#3B5998',
  },
  backButtonDark: {
    backgroundColor: '#444444',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppInfoScreen;
