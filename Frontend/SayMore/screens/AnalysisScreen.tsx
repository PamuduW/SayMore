import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AnalysisScreen = ({ route }) => {
  const { filename, acc_id, type, language } = route.params;
  const [responseData, setResponseData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const sendPostRequest = async () => {
      try {
        const response = await fetch(
          'https://saymore-monorepo-8d4fc9b224ef.herokuapp.com/test',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file_name: filename,
              acc_id: acc_id,
              test_type: type,
              lan_flag: language,
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('Response data:', data);
        setResponseData(data);
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type, language]);

  const handleNext = () => {
    if (responseData) {
      const { result } = responseData;
      const {
        final_public_speaking_score,
        final_public_speaking_feedback,
        'Voice_Quality_&_Stability_Data': {
          base_feedback: voiceBaseFeedback,
          dynamic_feedback: voiceDynamicFeedback,
        },
        'Speech_Intensity_&_Energy_Data': {
          base_feedback: speechBaseFeedback,
          dynamic_feedback: speechDynamicFeedback,
        },
      } = result;

      navigation.navigate('FeedbackScreen', {
        final_public_speaking_score,
        final_public_speaking_feedback,
        voiceBaseFeedback,
        voiceDynamicFeedback,
        speechBaseFeedback,
        speechDynamicFeedback,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Analysis Screen</Text>
      {responseData && (
        <View>
          <Text style={styles.scoreText}>
            Public Speaking Score:{' '}
            {responseData.result.final_public_speaking_score}
          </Text>
          <Button title="Next" onPress={handleNext} />
        </View>
      )}
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
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default AnalysisScreen;
