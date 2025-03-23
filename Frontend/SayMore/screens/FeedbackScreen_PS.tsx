import React from 'react';
import { Text, StyleSheet, ScrollView, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface FeedbackScreen_PSProps {
  route: {
    params: {
      final_public_speaking_score: number;
      final_public_speaking_feedback: string;
      voiceBaseFeedback: string;
      voiceDynamicFeedback: string;
      speechBaseFeedback: string;
      speechDynamicFeedback: string;
      threeSmallestScores: {
        name: string;
        value: number;
        navigationTarget: string | null;
      }[]; // UPDATED
    };
  };
}

const FeedbackScreen_PS: React.FC<FeedbackScreen_PSProps> = ({ route }) => {
  const {
    final_public_speaking_score,
    final_public_speaking_feedback,
    voiceBaseFeedback,
    voiceDynamicFeedback,
    speechBaseFeedback,
    speechDynamicFeedback,
    threeSmallestScores, // ADDED
  } = route.params;

  const navigation = useNavigation();

  const handleImprove = (navigationTarget: string | null) => {
    if (navigationTarget) {
      navigation.navigate(navigationTarget);
    } else {
      Alert.alert(
        'No Improvement Screen',
        'No specific screen to navigate to for this score.'
      );
    }
  };

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

      <Text style={styles.subtitle}>Areas to Improve:</Text>
      {threeSmallestScores &&
        threeSmallestScores.map((score, index) => (
          <View key={index} style={styles.scoreItem}>
            <Text style={styles.scoreName}>{score.name}:</Text>
            <Text style={styles.scoreValue}>{score.value}</Text>
            <Button
              title="Improve"
              onPress={() => handleImprove(score.navigationTarget)}
            />
          </View>
        ))}
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scoreName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 16,
  },
});

export default FeedbackScreen_PS;
