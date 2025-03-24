import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ProgressChart, LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const parentViewWidth = screenWidth - 70;

const TestHistory_PS: React.FC = () => {
  const route = useRoute<any>();
  const { testId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [responseData, setResponseData] = useState<any>(null);
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

  const [pitch_graph_data, setPitch_graph_data] = useState({
    labels: ['0.0'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Mean Pitch (ST)'],
  });

  const [hnr_graph_data, setHnr_graph_data] = useState({
    labels: ['0.0'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['HNR'],
  });

  const [shimmer_graph_data, setShimmer_graph_data] = useState({
    labels: ['0.0'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Shimmer'],
  });

  const [jitter_graph_data, setJitter_graph_data] = useState({
    labels: ['0.0'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Jitter'],
  });

  const [intensity_graph_data, setIntensity_graph_data] = useState({
    labels: ['0.0'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Intensity'],
  });

  const [energy_graph_data, setEnergy_graph_data] = useState({
    labels: ['0.0'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Energy'],
  });

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        const user = auth().currentUser;
        if (!user) {
          console.log('User not logged in');
          setLoading(false);
          return;
        }
        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          const psData = userData?.results?.PS_Check;
          if (psData && psData[testId]) {
            setResponseData(psData[testId]);
            setData({
              labels: ['Energy', 'Voice', 'Final'],
              data: [
                psData[testId]['Speech_Intensity_&_Energy_Data']
                  .final_energy_score / 100,
                psData[testId]['Voice_Quality_&_Stability_Data']
                  .final_voice_score / 100,
                psData[testId].final_public_speaking_score / 100,
              ],
            });
          } else {
            console.log('No test data found for testId:', testId);
          }
        } else {
          console.log('No user document found.');
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId]);

  useEffect(() => {
    if (responseData) {
      const pitch_labels = Object.keys(
        responseData['Voice_Quality_&_Stability_Data'].pitch_data
      ).reverse();
      const pitch_dataset = pitch_labels
        .map(
          key =>
            responseData['Voice_Quality_&_Stability_Data'].pitch_data[key]
              .mean_pitch_ST
        )
        .reverse();

      const hnr_labels = Object.keys(
        responseData['Voice_Quality_&_Stability_Data'].hnr_data
      ).reverse();
      const hnr_dataset = hnr_labels
        .map(
          key => responseData['Voice_Quality_&_Stability_Data'].hnr_data[key]
        )
        .reverse();

      const shimmer_labels = Object.keys(
        responseData['Voice_Quality_&_Stability_Data'].shimmer_data
      ).reverse();
      const shimmer_dataset = shimmer_labels
        .map(
          key =>
            responseData['Voice_Quality_&_Stability_Data'].shimmer_data[key]
        )
        .reverse();

      const jitter_labels = Object.keys(
        responseData['Voice_Quality_&_Stability_Data'].jitter_data
      ).reverse();
      const jitter_dataset = jitter_labels
        .map(
          key => responseData['Voice_Quality_&_Stability_Data'].jitter_data[key]
        )
        .reverse();

      const intensity_labels = Object.keys(
        responseData['Speech_Intensity_&_Energy_Data'].intensity_analysis
      ).reverse();
      const intensity_dataset = intensity_labels
        .map(
          key =>
            responseData['Speech_Intensity_&_Energy_Data'].intensity_analysis[
              key
            ]
        )
        .reverse();

      const energy_labels = Object.keys(
        responseData['Speech_Intensity_&_Energy_Data'].energy_analysis
      ).reverse();
      const energy_dataset = energy_labels
        .map(
          key =>
            responseData['Speech_Intensity_&_Energy_Data'].energy_analysis[key]
        )
        .reverse();

      setPitch_graph_data(prevData => ({
        ...prevData,
        labels: pitch_labels,
        datasets: [
          {
            data: pitch_dataset,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }));

      setHnr_graph_data(prevData => ({
        ...prevData,
        labels: hnr_labels,
        datasets: [
          {
            data: hnr_dataset,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }));

      setShimmer_graph_data(prevData => ({
        ...prevData,
        labels: shimmer_labels,
        datasets: [
          {
            data: shimmer_dataset,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }));

      setJitter_graph_data(prevData => ({
        ...prevData,
        labels: jitter_labels,
        datasets: [
          {
            data: jitter_dataset,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }));

      setIntensity_graph_data(prevData => ({
        ...prevData,
        labels: intensity_labels,
        datasets: [
          {
            data: intensity_dataset,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }));

      setEnergy_graph_data(prevData => ({
        ...prevData,
        labels: energy_labels,
        datasets: [
          {
            data: energy_dataset,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }));
    }
  }, [responseData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#577BC1" />
        <Text>Loading test data...</Text>
      </View>
    );
  }

  if (!responseData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No test data found for this test.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
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
                  {responseData.final_public_speaking_score}
                </Text>
              </View>

              <View style={styles.feedbackBlock}>
                <Text style={styles.label}>Overall Confidence Score</Text>
                <Text style={styles.valueHighlight}>
                  {responseData.overall_confidence}
                </Text>
              </View>

              <View style={styles.feedbackBlock}>
                <Text style={styles.label}>Voice Quality & Stability Data</Text>
                <Text style={styles.value}>
                  Final Voice Score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .final_voice_score
                  }
                </Text>
                <Text style={styles.value}>
                  variation_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .variation_score
                  }
                </Text>
                <Text style={styles.value}>
                  stability_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .stability_score
                  }
                </Text>
                <Text style={styles.value}>
                  speaking_speed:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .speaking_speed
                  }
                </Text>
                <Text style={styles.value}>
                  clarity:{' '}
                  {responseData['Voice_Quality_&_Stability_Data'].clarity}
                </Text>
                <Text style={styles.value}>
                  overall_jitter_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .overall_jitter_score
                  }
                </Text>
                <Text style={styles.value}>
                  overall_shimmer_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .overall_shimmer_score
                  }
                </Text>
                <Text style={styles.value}>
                  overall_hnr_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .overall_hnr_score
                  }
                </Text>
              </View>

              <View style={styles.feedbackBlock}>
                <Text style={styles.label}>Speech Intensity & Energy Data</Text>
                <Text style={styles.value}>
                  final_energy_score:{' '}
                  {
                    responseData['Speech_Intensity_&_Energy_Data']
                      .final_energy_score
                  }
                </Text>
                <Text style={styles.value}>
                  intensity_score:{' '}
                  {
                    responseData['Speech_Intensity_&_Energy_Data']
                      .intensity_score
                  }
                </Text>
                <Text style={styles.value}>
                  energy_score:{' '}
                  {responseData['Speech_Intensity_&_Energy_Data'].energy_score}
                </Text>
                <Text style={styles.value}>
                  variation_score:{' '}
                  {
                    responseData['Speech_Intensity_&_Energy_Data']
                      .variation_score
                  }
                </Text>
              </View>

              <View style={styles.feedbackBlock}>
                <Text style={styles.label}>Transcription</Text>
                <Text style={styles.value}>
                  {responseData.transcription[0].transcript}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      <LinearGradient
        colors={
          theme === 'dark' ? ['#3A3A3A', '#1C1C1C'] : ['#577BC1', '#577BC1']
        }
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Your Speech Feedback</Text>

          <View style={styles.feedbackBlock}>
            <Text style={styles.label}>Final Public Speaking Score</Text>
            <Text style={styles.valueHighlight}>
              {responseData.final_public_speaking_score}
            </Text>
          </View>

          <View style={styles.feedbackBlock}>
            <Text style={styles.label}>Overall Feedback</Text>
            <Text style={styles.value}>
              {responseData.final_public_speaking_feedback}
            </Text>
          </View>

          <View style={styles.feedbackBlock}>
            <Text style={styles.label}>Voice Quality</Text>
            <Text style={styles.value}>
              {responseData['Voice_Quality_&_Stability_Data'].base_feedback}
            </Text>
            <Text style={styles.value}>
              {responseData['Voice_Quality_&_Stability_Data'].dynamic_feedback}
            </Text>
          </View>

          <View style={styles.feedbackBlock}>
            <Text style={styles.label}>Speech Energy</Text>
            <Text style={styles.value}>
              {responseData['Speech_Intensity_&_Energy_Data'].base_feedback}
            </Text>
            <Text style={styles.value}>
              {responseData['Speech_Intensity_&_Energy_Data'].dynamic_feedback}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      <LinearGradient
        colors={
          theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
        }
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Additional Details</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={pitch_graph_data}
              width={screenWidth}
              height={250}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={hnr_graph_data}
              width={screenWidth}
              height={250}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={shimmer_graph_data}
              width={screenWidth}
              height={250}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={jitter_graph_data}
              width={screenWidth}
              height={250}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={intensity_graph_data}
              width={screenWidth}
              height={250}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={energy_graph_data}
              width={screenWidth}
              height={250}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </ScrollView>
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
  chartContainer: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default TestHistory_PS;
