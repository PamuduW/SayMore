import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface AnalysisSProps {
  filename: string;
  acc_id: string;
  type: string;
}

const Analysis_S: React.FC<AnalysisSProps> = ({ filename, acc_id, type }) => {
  const [responseData, setResponseData] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const sendPostRequest = async () => {
      try {
        const requestBody = {
          file_name: filename,
          acc_id: acc_id,
          test_type: type,
          lan_flag: 'language',
        };

        const response = await fetch(
          'https://saymore-monorepo-8d4fc9b224ef.herokuapp.com/test',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseInfo = await response.json();

        if (
          !responseInfo.result.transcription ||
          !responseInfo.result.transcription[0]
        ) {
          Alert.alert(
            'Error',
            'The transcript is empty! make sure your mic is working'
          );
          navigation.navigate('HomeScreen');
          return;
        }

        setResponseData(responseInfo);
      } catch (error) {
        //console.error('Error sending POST request:', error);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type]);

  const handleNext = () => {
    if (responseData) {
      const { result } = responseData;
      const stutter_feedback = result.dynamic_feedback;
      const stutter_count = result.stutter_count;
      const stutter_score = result.stutter_score;

      navigation.navigate('FeedbackScreen_S', {
        stutter_feedback,
        stutter_count,
        stutter_score,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Analysis Screen</Text>
      {responseData && (
        <View>
          <Text style={styles.jsonText}>
            {JSON.stringify(responseData, null, 2)}
          </Text>

          <Text>Stutter score: {responseData.result.stutter_score / 100}</Text>
          <Button title="Next" onPress={handleNext} style={styles.button} />
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
  jsonText: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginVertical: 10,
  },
});

export default Analysis_S;
