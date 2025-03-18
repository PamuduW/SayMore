import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

const FeedbackScreen_PS = ({ route }) => {
  const {
    final_public_speaking_score,
    final_public_speaking_feedback,
    voiceBaseFeedback,
    voiceDynamicFeedback,
    speechBaseFeedback,
    speechDynamicFeedback,
  } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.label}>Public Speaking Score:</Text>
      <Text style={styles.value}>{final_public_speaking_score}</Text>
      <Text style={styles.label}>Public Speaking Feedback:</Text>
      <Text style={styles.value}>{final_public_speaking_feedback}</Text>
      <Text style={styles.label}>Voice Quality & Stability Feedback:</Text>
      <Text style={styles.value}>{voiceBaseFeedback}</Text>
      <Text style={styles.value}>{voiceDynamicFeedback}</Text>
      <Text style={styles.label}>Speech Intensity & Energy Feedback:</Text>
      <Text style={styles.value}>{speechBaseFeedback}</Text>
      <Text style={styles.value}>{speechDynamicFeedback}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default FeedbackScreen_PS;
