import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const parentViewWidth = screenWidth - 70;

interface AnalysisSProps {
  filename: string;
  acc_id: string;
  type: string;
}

interface AnalysisResult {
  language: string;
  stutter_count: number;
  stuttered_words: Array<{
    word: string;
    type: string;
  }>;
  cluttering_detected: boolean;
  fluency_score: number;
  stuttering_score: number;
  dynamic_feedback: string;
  confidence_score: number;
  transcript: string;
}

const Analysis_S: React.FC<AnalysisSProps> = ({ filename, acc_id, type }) => {
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [data, setData] = useState({
    labels: ['Energy', 'Voice', 'Final'],
    data: [0, 0, 0],
  });
  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'transparent',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };
  const theme = useTheme();

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

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

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
        setData({
          labels: ['Fluency', 'Confidence', 'Stuttering'],
          data: [
            responseInfo.result.fluency_score / 100,
            responseInfo.result.confidence_score / 100,
            responseInfo.result.stuttering_score / 100,
          ],
        });
      } catch (error) {
        //console.error('Error sending POST request:', error);
      } finally {
        setLoading(false);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type, navigation]);

  const handleNext = () => {
    if (responseData) {
      const { result } = responseData as AnalysisResult;

      const { dynamic_feedback, stutter_count, stutter_score } = result;

      navigation.navigate('FeedbackScreen_S', {
        stutter_feedback,
        stutter_count,
        stutter_score,
      });
    }
  };

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Analyzing Speech...</Text>
        </View>
      );
    }

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
        </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingBottom: 40,
    paddingTop: 50,
  },
});

export default Analysis_S;
