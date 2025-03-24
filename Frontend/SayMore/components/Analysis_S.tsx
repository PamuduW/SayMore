import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Button,
  Dimensions,
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

        if (!responseInfo.result.transcript) {
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

      const { dynamic_feedback, stutter_count, stuttering_score } = result;

      navigation.navigate('FeedbackScreen_S', {
        dynamic_feedback,
        stutter_count,
        stuttering_score,
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
        <Text style={styles.title}>Your Speech Analysis</Text>
        <View style={styles.feedbackBlock}>
          <ProgressChart
            data={data}
            width={parentViewWidth}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </View>

        {responseData && (
          <View>
            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Stuttering score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.result.stuttering_score}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Confidence score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.result.confidence_score}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Fluency score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.result.fluency_score}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Language</Text>
              <Text style={styles.valueHighlight}>
                {responseData.result.language}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Stutter count</Text>
              <Text style={styles.valueHighlight}>
                {responseData.result.stutter_count}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Stuttered words</Text>
              {responseData.result.stuttered_words.map((item, index) => (
                <View key={index}>
                  <Text style={styles.label}> </Text>
                  <Text style={styles.value}>Word: {item.word}</Text>
                  <Text style={styles.value}>Type: {item.type}</Text>
                </View>
              ))}
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Transcript</Text>
              <Text style={styles.value}>{responseData.result.transcript}</Text>
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.button}>
              <Text style={styles.buttonText}>Feedback</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  feedbackBlock: {
    marginBottom: 20,
    backgroundColor: '#3e5a8f',
    padding: 16,
    borderRadius: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 16,
    color: '#D0D3E6',
  },
  valueHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#214283',
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Analysis_S;
