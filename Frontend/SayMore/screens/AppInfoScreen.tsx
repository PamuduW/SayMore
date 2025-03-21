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

const AppInfoScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#2A2D57', '#577BC1']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>App Information</Text>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>SayMore App</Text>
          <Text style={styles.subText}>Version: 1.0.0</Text>

          <Text style={styles.sectionHeader}>Overview</Text>
          <Text style={styles.text}>
            SayMore is your personal companion for improving public speaking and
            speech fluency. Whether you're looking to overcome stuttering,
            refine your pronunciation, or build confidence in front of an
            audience, SayMore offers personalized exercises, audio analysis, and
            progress tracking features.
          </Text>

          <Text style={styles.sectionHeader}>Features</Text>
          <Text style={styles.text}>
            - Public Speaking Practice{'\n'}- Stuttering Assistance Exercises
            {'\n'}- Personalized Audio Feedback{'\n'}- Progress Analysis and
            Metrics{'\n'}- Customizable User Profile
          </Text>

          <Text style={styles.sectionHeader}>Developer</Text>
          <Text style={styles.text}>
            Developed by SayMore Team{'\n'}
            For support or inquiries:{'\n'}
            Email: support@saymoreapp.com
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={styles.backButton}
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

  scrollContent: { padding: 25 },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2D57',
    marginBottom: 5,
  },

  headerUnderline: {
      marginTop: 6,
      width: 210,
      height: 3,
      backgroundColor: '#D0D3E6',
      borderRadius: 2,
    },

  subText: {
    fontSize: 14,
    color: '#3B5998',
    marginBottom: 20,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B5998',
    marginTop: 15,
    marginBottom: 8,
  },

  text: {
    fontSize: 15.5,
    color: '#2A2D57',
    lineHeight: 24,
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

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppInfoScreen;
