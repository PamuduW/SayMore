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

      const AppInfoScreen = () => {
        const navigation = useNavigation();
        const theme = useTheme();

        return (
          <LinearGradient
            colors={theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']}
            style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.headerBar}>
              <Text style={styles.headerText}>App Information</Text>
            </View>

            <View style={styles.contentWrapper}>
              <ScrollView
                style={[
                  styles.scrollContainer,
                  theme === 'dark' && styles.darkScrollContainer,
                ]}
                contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, theme === 'dark' && styles.darkTitle]}>
                  SayMore App
                </Text>
                <Text style={[styles.subText, theme === 'dark' && styles.darkSubText]}>
                  Version: 1.0.0
                </Text>

                <Text style={[styles.sectionHeader, theme === 'dark' && styles.darkSectionHeader]}>
                  Overview
                </Text>
                <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
                  SayMore is your personal companion for improving public speaking and
                  speech fluency. Whether you're looking to overcome stuttering,
                  refine your pronunciation, or build confidence in front of an
                  audience, SayMore offers personalized exercises, audio analysis, and
                  progress tracking features.
                </Text>

                <Text style={[styles.sectionHeader, theme === 'dark' && styles.darkSectionHeader]}>
                  Features
                </Text>
                <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
                  - Public Speaking Practice{'\n'}- Stuttering Assistance Exercises
                  {'\n'}- Personalized Audio Feedback{'\n'}- Progress Analysis and
                  Metrics{'\n'}- Customizable User Profile
                </Text>

                <Text style={[styles.sectionHeader, theme === 'dark' && styles.darkSectionHeader]}>
                  Developer
                </Text>
                <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
                  Developed by SayMore Team{'\n'}
                  For support or inquiries:{'\n'}
                  Email: support@saymoreapp.com
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

        contentWrapper: { flex: 1, paddingHorizontal: 20 },

        scrollContainer: {
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 7,
          elevation: 9,
        },

        darkScrollContainer: {
          backgroundColor: '#1a1a1a',
        },

        scrollContent: { padding: 25 },

        title: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#2A2D57',
          marginBottom: 5,
        },

        darkTitle: {
          color: '#FFFFFF',
        },

        subText: {
          fontSize: 14,
          color: '#3B5998',
          marginBottom: 20,
        },

        darkSubText: {
          color: '#FFFFFF',
        },

        sectionHeader: {
          fontSize: 18,
          fontWeight: '700',
          color: '#3B5998',
          marginTop: 15,
          marginBottom: 8,
        },

        darkSectionHeader: {
          color: '#FFFFFF',
        },

        text: {
          fontSize: 15.5,
          color: '#2A2D57',
          lineHeight: 24,
        },

        darkText: {
          color: '#FFFFFF',
        },

        backButton: {
          marginTop: 20,
          marginBottom: 15,
          alignSelf: 'center',
          backgroundColor: '#3B5998',
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 25,
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

      export default AppInfoScreen;