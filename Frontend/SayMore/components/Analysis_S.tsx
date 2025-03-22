import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Analysis_SProps {
  filename: string;
  acc_id: string;
  type: string;
}

const Analysis_S: React.FC<Analysis_SProps> = ({ filename, acc_id, type }) => {
  const [responseData, setResponseData] = useState<any>(null);
  const navigation = useNavigation();
  const [stutterScore, setStutterScore] = useState<number | null>(null); // Store stutter score

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
          const errorText = await response.text(); // Get error message from the response
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const responseInfo = await response.json();
        setResponseData(responseInfo);
        const score = responseInfo?.result?.stutter_score;

        if (typeof score === 'number') {
            setStutterScore(score);
        } else if (typeof score === 'string') {
            const parsedScore = parseInt(score, 10);
            if (!isNaN(parsedScore)) {
                setStutterScore(parsedScore);
            } else {
                console.error("Could not parse stutter_score to number");
                setStutterScore(0); // Set a default value or handle the error appropriately
            }
        } else {
            console.error("stutter_score is not a number or string");
            setStutterScore(0);
        }


      } catch (error: any) {
        console.error('Error sending POST request:', error);
        // You might want to set an error state here to display an error message to the user.
        // Example:  setError("Failed to analyze. Please try again.");
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type]);

  const handleNext = () => {
    if (responseData && stutterScore !== null) {
      const { result } = responseData;
      const { stutter_feedback } = result;

      navigation.navigate('FeedbackScreen_S', {
        stutter_feedback,
        stutter_score: stutterScore, // Pass the score
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Analysis Screen</Text>
      {responseData && stutterScore !== null && (
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