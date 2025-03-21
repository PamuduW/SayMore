import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Button,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Analysis_PS = ({ filename, acc_id, type, language }) => {
  const [responseData, setResponseData] = useState(null);
  const navigation = useNavigation();
  const [data, setData] = useState({
    labels: [
      'final_energy_score',
      'final_voice_score',
      'final_public_speaking_score',
    ],
    data: [0, 0, 0],
  });
  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'transparent',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
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
          labels: [
            'final_energy_score',
            'final_voice_score',
            'final_public_speaking_score',
          ],
          data: [
            responseInfo.result['Speech_Intensity_&_Energy_Data']
              .final_energy_score / 100,
            responseInfo.result['Voice_Quality_&_Stability_Data']
              .final_voice_score / 100,
            responseInfo.result.final_public_speaking_score / 100,
          ],
        });
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type, language, navigation]);

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

      navigation.navigate('FeedbackScreen_PS', {
        final_public_speaking_score,
        final_public_speaking_feedback,
        voiceBaseFeedback,
        voiceDynamicFeedback,
        speechBaseFeedback,
        speechDynamicFeedback,
      });
    }
  };

  const handleDetails = () => {
    if (responseData) {
      const { result } = responseData;
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
      });
    }
  };

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

          <Button title="Next" onPress={handleNext} style={styles.button} />
          <Button
            title="Additional Details"
            onPress={handleDetails}
            style={styles.button}
          />
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
  progressChartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default Analysis_PS;
