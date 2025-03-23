import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Button,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

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
        // Optionally handle error here
      } finally {
        setLoading(false);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type, language, navigation]);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progressChartText}>Analysis Screen</Text>
      <ProgressChart
        data={data}
        width={screenWidth}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
      />
      {responseData && (
        <View>
          <Text style={styles.scoreText}>
            Final Public Speaking Score:{' '}
            {responseData.result.final_public_speaking_score}
          </Text>
          <Text style={styles.scoreText}>
            Overall Confidence Score: {responseData.result.overall_confidence}
          </Text>

          <Text style={styles.scoreText}>Voice Quality & Stability Data</Text>
          <Text>
            Final Voice Score:{' '}
            {
              responseData.result['Voice_Quality_&_Stability_Data']
                .final_voice_score
            }
          </Text>
          <Text>
            variation_score:{' '}
            {
              responseData.result['Voice_Quality_&_Stability_Data']
                .variation_score
            }
          </Text>
          <Text>
            stability_score:{' '}
            {
              responseData.result['Voice_Quality_&_Stability_Data']
                .stability_score
            }
          </Text>
          <Text>
            speaking_speed:{' '}
            {
              responseData.result['Voice_Quality_&_Stability_Data']
                .speaking_speed
            }
          </Text>
          <Text>
            clarity:{' '}
            {responseData.result['Voice_Quality_&_Stability_Data'].clarity}
          </Text>
          <Text>
            overall_jitter_score:{' '}
            {
              responseData.result['Voice_Quality_&_Stability_Data']
                .overall_jitter_score
            }
          </Text>
          <Text>
            overall_shimmer_score:{' '}
            {
              responseData.result['Voice_Quality_&_Stability_Data']
                .overall_shimmer_score
            }
          </Text>
          <Text>
            overall_hnr_score:{' '}
            {
              responseData.result['Voice_Quality_&_Stability_Data']
                .overall_hnr_score
            }
          </Text>

          <Text style={styles.scoreText}>Speech Intensity & Energy Data</Text>
          <Text>
            final_energy_score:{' '}
            {
              responseData.result['Speech_Intensity_&_Energy_Data']
                .final_energy_score
            }
          </Text>
          <Text>
            intensity_score:{' '}
            {
              responseData.result['Speech_Intensity_&_Energy_Data']
                .intensity_score
            }
          </Text>
          <Text>
            energy_score:{' '}
            {responseData.result['Speech_Intensity_&_Energy_Data'].energy_score}
          </Text>
          <Text>
            variation_score:{' '}
            {
              responseData.result['Speech_Intensity_&_Energy_Data']
                .variation_score
            }
          </Text>

          <Text style={styles.scoreText}>Transcription</Text>
          <Text>{responseData.result.transcription[0].transcript}</Text>

          <Button title="Next" onPress={handleNext} />
          <Button title="Additional Details" onPress={handleDetails} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  progressChartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default Analysis_PS;
