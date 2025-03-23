import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ProgressChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const TestHistory_PS: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
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
          const data = userDoc.data();
          // Assuming public speaking tests are stored under results.PS_Check keyed by testId.
          const psData = data?.results?.PS_Check;
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

    //       {/* "More" Button toggles additional charts */}
    //       <TouchableOpacity
    //         style={styles.moreButton}
    //         onPress={() => setShowMore(!showMore)}
    //       >
    //         <Text style={styles.moreButtonText}>{showMore ? 'Less' : 'More'}</Text>
    //       </TouchableOpacity>
    //       {showMore && (
    //         <View style={styles.moreContainer}>
    //           {/* Render charts similar to AdditionalDetailsScreen */}
    //           {pitch_data && (
    //             <View style={styles.chartContainer}>
    //               <Text style={styles.chartTitle}>Pitch Data</Text>
    //               <LineChart
    //                 data={createChartData(pitch_data, true)}
    //                 width={screenWidth - 32}
    //                 height={250}
    //                 verticalLabelRotation={30}
    //                 chartConfig={chartConfig}
    //                 bezier
    //               />
    //             </View>
    //           )}
    //           {hnr_data && (
    //             <View style={styles.chartContainer}>
    //               <Text style={styles.chartTitle}>HNR</Text>
    //               <LineChart
    //                 data={createChartData(hnr_data)}
    //                 width={screenWidth - 32}
    //                 height={250}
    //                 verticalLabelRotation={30}
    //                 chartConfig={chartConfig}
    //                 bezier
    //               />
    //             </View>
    //           )}
    //           {shimmer_data && (
    //             <View style={styles.chartContainer}>
    //               <Text style={styles.chartTitle}>Shimmer</Text>
    //               <LineChart
    //                 data={createChartData(shimmer_data)}
    //                 width={screenWidth - 32}
    //                 height={250}
    //                 verticalLabelRotation={30}
    //                 chartConfig={chartConfig}
    //                 bezier
    //               />
    //             </View>
    //           )}
    //           {jitter_data && (
    //             <View style={styles.chartContainer}>
    //               <Text style={styles.chartTitle}>Jitter</Text>
    //               <LineChart
    //                 data={createChartData(jitter_data)}
    //                 width={screenWidth - 32}
    //                 height={250}
    //                 verticalLabelRotation={30}
    //                 chartConfig={chartConfig}
    //                 bezier
    //               />
    //             </View>
    //           )}
    //           {intensity_analysis && (
    //             <View style={styles.chartContainer}>
    //               <Text style={styles.chartTitle}>Intensity Analysis</Text>
    //               <LineChart
    //                 data={createChartData(intensity_analysis)}
    //                 width={screenWidth - 32}
    //                 height={250}
    //                 verticalLabelRotation={30}
    //                 chartConfig={chartConfig}
    //                 bezier
    //               />
    //             </View>
    //           )}
    //           {energy_analysis && (
    //             <View style={styles.chartContainer}>
    //               <Text style={styles.chartTitle}>Energy Analysis</Text>
    //               <LineChart
    //                 data={createChartData(energy_analysis)}
    //                 width={screenWidth - 32}
    //                 height={250}
    //                 verticalLabelRotation={30}
    //                 chartConfig={chartConfig}
    //                 bezier
    //               />
    //             </View>
    //           )}
    //         </View>
    //       )}
    //     </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  dataBlock: {
    width: '100%',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 18,
    marginTop: 4,
  },
  feedbackBlock: {
    width: '100%',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#034694',
    borderRadius: 8,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  feedbackValue: {
    fontSize: 16,
    color: '#D0D3E6',
  },
  moreButton: {
    marginVertical: 20,
    backgroundColor: '#577BC1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  moreButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  moreContainer: {
    width: '100%',
    marginBottom: 30,
  },
  chartContainer: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TestHistory_PS;
