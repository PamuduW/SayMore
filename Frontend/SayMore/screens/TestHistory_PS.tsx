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
import { ProgressChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const parentViewWidth = screenWidth - 70; // Assuming 16 padding on each side

const TestHistory_PS: React.FC = () => {
  const route = useRoute<any>();
  const { testId } = route.params; // received testId from TestHistory.tsx
  const [loading, setLoading] = useState<boolean>(true);
  const [responseData, setResponseData] = useState<any>(null);
  const [showMore, setShowMore] = useState<boolean>(false);
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
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };
  const theme = useTheme();

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
        // Get the user's document from "User_Accounts" collection.
        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          // Assuming public speaking tests are stored under results.PS_Check keyed by testId.
          const psData = userData?.results?.PS_Check;
          if (psData && psData[testId]) {
            setResponseData(psData[testId]);
            setData({
              labels: [
                'final_energy_score',
                'final_voice_score',
                'final_public_speaking_score',
              ],
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

                <Text>
                  Final Voice Score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .final_voice_score
                  }
                </Text>
                <Text>
                  variation_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .variation_score
                  }
                </Text>
                <Text>
                  stability_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .stability_score
                  }
                </Text>
                <Text>
                  speaking_speed:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .speaking_speed
                  }
                </Text>
                <Text>
                  clarity:{' '}
                  {responseData['Voice_Quality_&_Stability_Data'].clarity}
                </Text>
                <Text>
                  overall_jitter_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .overall_jitter_score
                  }
                </Text>
                <Text>
                  overall_shimmer_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .overall_shimmer_score
                  }
                </Text>
                <Text>
                  overall_hnr_score:{' '}
                  {
                    responseData['Voice_Quality_&_Stability_Data']
                      .overall_hnr_score
                  }
                </Text>
              </View>

              <Text style={styles.scoreText}>
                Speech Intensity & Energy Data
              </Text>
              <Text>
                final_energy_score:{' '}
                {
                  responseData['Speech_Intensity_&_Energy_Data']
                    .final_energy_score
                }
              </Text>
              <Text>
                intensity_score:{' '}
                {responseData['Speech_Intensity_&_Energy_Data'].intensity_score}
              </Text>
              <Text>
                energy_score:{' '}
                {responseData['Speech_Intensity_&_Energy_Data'].energy_score}
              </Text>
              <Text>
                variation_score:{' '}
                {responseData['Speech_Intensity_&_Energy_Data'].variation_score}
              </Text>

              <Text style={styles.scoreText}>Transcription</Text>
              <Text>{responseData.transcription[0].transcript}</Text>
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
    backgroundColor: '#034694',
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
});

export default TestHistory_PS;
