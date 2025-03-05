import React from 'react';
import { Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdditionalDetailsScreen = ({ route }) => {
  const {
    final_public_speaking_score,
    final_public_speaking_feedback,
    voiceBaseFeedback,
    voiceDynamicFeedback,
    speechBaseFeedback,
    speechDynamicFeedback,
    pitch_data,
    hnr_data,
    shimmer_data,
    jitter_data,
    intensity_analysis,
    energy_analysis,
  } = route.params;

  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('FeedbackScreen', {
      final_public_speaking_score,
      final_public_speaking_feedback,
      voiceBaseFeedback,
      voiceDynamicFeedback,
      speechBaseFeedback,
      speechDynamicFeedback,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Additional Details</Text>
      <Button title="Next" onPress={handleNext} />
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

export default AdditionalDetailsScreen;
