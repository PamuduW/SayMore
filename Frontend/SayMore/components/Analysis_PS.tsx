import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
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

interface Analysis_PSProps {
  filename: string;
  acc_id: string;
  type: string;
  language: string;
}

interface AnalysisResult {
  final_public_speaking_score: number;
  overall_confidence: number;
  'Voice_Quality_&_Stability_Data': {
    final_voice_score: number;
    variation_score: number;
    stability_score: number;
    speaking_speed: number;
    clarity: number;
    overall_jitter_score: number;
    overall_shimmer_score: number;
    overall_hnr_score: number;
    base_feedback: string;
    dynamic_feedback: string;
    pitch_data: any;
    hnr_data: any;
    shimmer_data: any;
    jitter_data: any;
  };
  'Speech_Intensity_&_Energy_Data': {
    final_energy_score: number;
    intensity_score: number;
    energy_score: number;
    variation_score: number;
    base_feedback: string;
    dynamic_feedback: string;
    intensity_analysis: any;
    energy_analysis: any;
  };
  final_public_speaking_feedback: string;
  transcription: any;
}

/**
 * Analysis_PS component that displays the analysis results of a public speaking test.
 * @param {Analysis_PSProps} props - The properties for the component.
 * @param {string} props.filename - The filename of the audio file.
 * @param {string} props.acc_id - The account ID of the user.
 * @param {string} props.type - The type of the test.
 * @param {string} props.language - The language of the test.
 * @returns {JSX.Element} The rendered component.
 */
const Analysis_PS: React.FC<Analysis_PSProps> = ({
  filename,
  acc_id,
  type,
  language,
}) => {
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
          lan_flag: language,
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
          labels: ['Energy', 'Voice', 'Final'],
          data: [
            responseInfo.result['Speech_Intensity_&_Energy_Data']
              .final_energy_score / 100,
            responseInfo.result['Voice_Quality_&_Stability_Data']
              .final_voice_score / 100,
            responseInfo.result.final_public_speaking_score / 100,
          ],
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type, language, navigation]);

  /**
   * Calculates the three smallest scores from the analysis result.
   * @param {AnalysisResult} result - The analysis result.
   * @returns {Array} The three smallest scores.
   */
  const calculateThreeSmallestScores = (result: AnalysisResult) => {
    const scores = [
      {
        name: 'Final Public Speaking Score',
        value: result.final_public_speaking_score,
        navigationTarget: null,
      },
      {
        name: 'Overall Confidence Score',
        value: result.overall_confidence,
        navigationTarget: null,
      },
      {
        name: 'Final Voice Score',
        value: result['Voice_Quality_&_Stability_Data'].final_voice_score,
        navigationTarget: 'LessonRedirectionScreen',
      },
      {
        name: 'variation_score (Voice)',
        value: result['Voice_Quality_&_Stability_Data'].variation_score,
        navigationTarget: 'ClarityAndPitchScreen',
      },
      {
        name: 'stability_score (Voice)',
        value: result['Voice_Quality_&_Stability_Data'].stability_score,
        navigationTarget: 'ClarityAndPitchScreen',
      },
      {
        name: 'speaking_speed',
        value: result['Voice_Quality_&_Stability_Data'].speaking_speed,
        navigationTarget: 'SpeakingWithEnergyScreen',
      },
      {
        name: 'clarity',
        value: result['Voice_Quality_&_Stability_Data'].clarity,
        navigationTarget: 'ClarityAndPitchScreen',
      },
      {
        name: 'overall_jitter_score',
        value: result['Voice_Quality_&_Stability_Data'].overall_jitter_score,
        navigationTarget: 'CommunicationAndStageFrightScreen',
      },
      {
        name: 'overall_shimmer_score',
        value: result['Voice_Quality_&_Stability_Data'].overall_shimmer_score,
        navigationTarget: 'SpeakingWithEnergyScreen',
      },
      {
        name: 'overall_hnr_score',
        value: result['Voice_Quality_&_Stability_Data'].overall_hnr_score,
        navigationTarget: 'CommunicationAndStageFrightScreen',
      },
      {
        name: 'final_energy_score',
        value: result['Speech_Intensity_&_Energy_Data'].final_energy_score,
        navigationTarget: 'SpeakingWithEnergyScreen',
      },
      {
        name: 'intensity_score',
        value: result['Speech_Intensity_&_Energy_Data'].intensity_score,
        navigationTarget: 'SpeakingWithEnergyScreen',
      },
      {
        name: 'energy_score',
        value: result['Speech_Intensity_&_Energy_Data'].energy_score,
        navigationTarget: 'SpeakingWithEnergyScreen',
      },
      {
        name: 'variation_score (Energy)',
        value: result['Speech_Intensity_&_Energy_Data'].variation_score,
        navigationTarget: 'CommunicationAndStageFrightScreen',
      },
    ];

    const sortedScores = scores.sort((a, b) => a.value - b.value);
    return sortedScores.slice(0, 3);
  };

  /**
   * Handles the navigation to the feedback screen.
   */
  const handleNext = () => {
    if (responseData) {
      const { result } = responseData as AnalysisResult;
      const threeSmallestScores = calculateThreeSmallestScores(result);

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

      navigation.navigate('FeedbackScreen_PS', {
        final_public_speaking_score,
        final_public_speaking_feedback,
        voiceBaseFeedback,
        voiceDynamicFeedback,
        speechBaseFeedback,
        speechDynamicFeedback,
        threeSmallestScores,
      });
    }
  };

  /**
   * Handles the navigation to the additional details screen.
   */
  const handleDetails = () => {
    if (responseData) {
      const { result } = responseData as AnalysisResult;
      const threeSmallestScores = calculateThreeSmallestScores(result);

      const {
        final_public_speaking_score,
        final_public_speaking_feedback,
        'Voice_Quality_&_Stability_Data': {
          base_feedback: voiceBaseFeedback,
          dynamic_feedback: voiceDynamicFeedback,
          pitch_data,
          hnr_data,
          shimmer_data,
          jitter_data,
        },
        'Speech_Intensity_&_Energy_Data': {
          base_feedback: speechBaseFeedback,
          dynamic_feedback: speechDynamicFeedback,
          intensity_analysis,
          energy_analysis,
        },
      } = result;

      navigation.navigate('AdditionalDetailsScreen', {
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
        threeSmallestScores,
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
              <Text style={styles.label}>Final Public Speaking Score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.result.final_public_speaking_score}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Overall Confidence Score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.result.overall_confidence}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Voice Quality & Stability Data</Text>
              <Text style={styles.value}>
                Final Voice Score:{' '}
                {
                  responseData.result['Voice_Quality_&_Stability_Data']
                    .final_voice_score
                }
              </Text>
              <Text style={styles.value}>
                variation_score:{' '}
                {
                  responseData.result['Voice_Quality_&_Stability_Data']
                    .variation_score
                }
              </Text>
              <Text style={styles.value}>
                stability_score:{' '}
                {
                  responseData.result['Voice_Quality_&_Stability_Data']
                    .stability_score
                }
              </Text>
              <Text style={styles.value}>
                speaking_speed:{' '}
                {
                  responseData.result['Voice_Quality_&_Stability_Data']
                    .speaking_speed
                }
              </Text>
              <Text style={styles.value}>
                clarity:{' '}
                {responseData.result['Voice_Quality_&_Stability_Data'].clarity}
              </Text>
              <Text style={styles.value}>
                overall_jitter_score:{' '}
                {
                  responseData.result['Voice_Quality_&_Stability_Data']
                    .overall_jitter_score
                }
              </Text>
              <Text style={styles.value}>
                overall_shimmer_score:{' '}
                {
                  responseData.result['Voice_Quality_&_Stability_Data']
                    .overall_shimmer_score
                }
              </Text>
              <Text style={styles.value}>
                overall_hnr_score:{' '}
                {
                  responseData.result['Voice_Quality_&_Stability_Data']
                    .overall_hnr_score
                }
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Speech Intensity & Energy Data</Text>
              <Text style={styles.value}>
                final_energy_score:{' '}
                {
                  responseData.result['Speech_Intensity_&_Energy_Data']
                    .final_energy_score
                }
              </Text>
              <Text style={styles.value}>
                intensity_score:{' '}
                {
                  responseData.result['Speech_Intensity_&_Energy_Data']
                    .intensity_score
                }
              </Text>
              <Text style={styles.value}>
                energy_score:{' '}
                {
                  responseData.result['Speech_Intensity_&_Energy_Data']
                    .energy_score
                }
              </Text>
              <Text style={styles.value}>
                variation_score:{' '}
                {
                  responseData.result['Speech_Intensity_&_Energy_Data']
                    .variation_score
                }
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Transcription</Text>
              <Text style={styles.value}>
                {responseData.result.transcription[0].transcript}
              </Text>
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.button}>
              <Text style={styles.buttonText}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDetails} style={styles.button}>
              <Text style={styles.buttonText}>Additional Details</Text>
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

export default Analysis_PS;
