import React from 'react';
import { Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface FeedbackScreen_SProps {
  route: {
    params: {
      stutter_feedback: string;
      stutter_score: number;
    };
  };
}

const FeedbackScreen_S: React.FC<FeedbackScreen_SProps> = ({ route }) => {
  const { stutter_feedback, stutter_score } = route.params;
  const navigation = useNavigation();

  const handleImprove = () => {
    if (stutter_score < 40) {
      navigation.navigate('LessonRedirectionStuttering');
    } else {
      navigation.navigate('UnderstandingAndOvercomingStutteringScreen');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.label}>Stutter feedback:</Text>
      <Text style={styles.value}>{stutter_feedback}</Text>
      <Button title="Improve" onPress={handleImprove} />
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