import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

const FeedbackScreen_S = ({ route }) => {
  const { stutter_feedback } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.label}>Stutter feedback:</Text>
      <Text style={styles.value}>{stutter_feedback}</Text>
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

export default FeedbackScreen_S;
