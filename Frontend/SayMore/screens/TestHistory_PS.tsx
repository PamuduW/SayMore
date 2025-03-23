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

// Chart configuration (from Analysis_PS and AdditionalDetailsScreen)
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

// Helper function to create chart data from a map.
// For pitch_data we assume each value is an object with a 'mean_pitch_ST' property;
// for others, we assume the value is numeric.
const createChartData = (dataMap: any, isPitchData: boolean = false) => {
  const labels = Object.keys(dataMap);
  const dataset = labels.map(key =>
    isPitchData ? dataMap[key].mean_pitch_ST : dataMap[key]
  );
  return {
    labels,
    datasets: [
      {
        data: dataset,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: [], // optionally add a legend
  };
};

const TestHistory_PS: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { testId } = route.params; // received testId from TestHistory.tsx
  const [loading, setLoading] = useState<boolean>(true);
  const [testData, setTestData] = useState<any>(null);
  const [showMore, setShowMore] = useState<boolean>(false);

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
            setTestData(psData[testId]);
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

  if (!testData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No test data found for this test.</Text>
      </View>
    );
  }

  // Destructure analysis and feedback related fields from testData.
  const {
    final_public_speaking_score,
    overall_confidence,
    Voice_Quality_Stability_Data,
    Speech_Intensity_Energy_Data,
    transcription,
    final_public_speaking_feedback,
    voiceBaseFeedback,
    voiceDynamicFeedback,
    speechBaseFeedback,
    speechDynamicFeedback,
    // Chart data fields:
    pitch_data,
    hnr_data,
    shimmer_data,
    jitter_data,
    intensity_analysis,
    energy_analysis,
  } = testData;

  // Prepare data for a progress chart (example: showing three scores).
  // You can adjust the labels and data as needed.
  const progressChartData = {
    labels: [
      'Energy',
      'Voice',
      'Public Speaking'
    ],
    data: [
      Speech_Intensity_Energy_Data?.final_energy_score / 100 || 0,
      Voice_Quality_Stability_Data?.final_voice_score / 100 || 0,
      final_public_speaking_score / 100 || 0,
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Analysis Section (similar to Analysis_PS.tsx) */}
      <Text style={styles.sectionTitle}>Analysis Data</Text>
      <ProgressChart
        data={progressChartData}
        width={screenWidth - 32}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
      />
      <View style={styles.dataBlock}>
        <Text style={styles.dataLabel}>Final Public Speaking Score:</Text>
        <Text style={styles.dataValue}>{final_public_speaking_score}</Text>
      </View>
      <View style={styles.dataBlock}>
        <Text style={styles.dataLabel}>Overall Confidence:</Text>
        <Text style={styles.dataValue}>{overall_confidence}</Text>
      </View>
      <View style={styles.dataBlock}>
        <Text style={styles.dataLabel}>Voice Quality & Stability:</Text>
        {Voice_Quality_Stability_Data && (
          <>
            <Text>Final Voice Score: {Voice_Quality_Stability_Data.final_voice_score}</Text>
            <Text>Variation: {Voice_Quality_Stability_Data.variation_score}</Text>
            <Text>Stability: {Voice_Quality_Stability_Data.stability_score}</Text>
            <Text>Speaking Speed: {Voice_Quality_Stability_Data.speaking_speed}</Text>
            <Text>Clarity: {Voice_Quality_Stability_Data.clarity}</Text>
          </>
        )}
      </View>
      <View style={styles.dataBlock}>
        <Text style={styles.dataLabel}>Speech Intensity & Energy:</Text>
        {Speech_Intensity_Energy_Data && (
          <>
            <Text>Final Energy Score: {Speech_Intensity_Energy_Data.final_energy_score}</Text>
            <Text>Intensity Score: {Speech_Intensity_Energy_Data.intensity_score}</Text>
            <Text>Energy Score: {Speech_Intensity_Energy_Data.energy_score}</Text>
          </>
        )}
      </View>
      {transcription && transcription[0] && (
        <View style={styles.dataBlock}>
          <Text style={styles.dataLabel}>Transcription:</Text>
          <Text>{transcription[0].transcript}</Text>
        </View>
      )}

      {/* Feedback Section (similar to FeedbackScreen_PS.tsx) */}
      <Text style={styles.sectionTitle}>Feedback</Text>
      <View style={styles.feedbackBlock}>
        <Text style={styles.feedbackLabel}>Overall Feedback:</Text>
        <Text style={styles.feedbackValue}>{final_public_speaking_feedback}</Text>
      </View>
      <View style={styles.feedbackBlock}>
        <Text style={styles.feedbackLabel}>Voice Feedback:</Text>
        <Text>{voiceBaseFeedback}</Text>
        <Text>{voiceDynamicFeedback}</Text>
      </View>
      <View style={styles.feedbackBlock}>
        <Text style={styles.feedbackLabel}>Speech Energy Feedback:</Text>
        <Text>{speechBaseFeedback}</Text>
        <Text>{speechDynamicFeedback}</Text>
      </View>

      {/* "More" Button toggles additional charts */}
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setShowMore(!showMore)}
      >
        <Text style={styles.moreButtonText}>{showMore ? 'Less' : 'More'}</Text>
      </TouchableOpacity>
      {showMore && (
        <View style={styles.moreContainer}>
          {/* Render charts similar to AdditionalDetailsScreen */}
          {pitch_data && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Pitch Data</Text>
              <LineChart
                data={createChartData(pitch_data, true)}
                width={screenWidth - 32}
                height={250}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          )}
          {hnr_data && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>HNR</Text>
              <LineChart
                data={createChartData(hnr_data)}
                width={screenWidth - 32}
                height={250}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          )}
          {shimmer_data && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Shimmer</Text>
              <LineChart
                data={createChartData(shimmer_data)}
                width={screenWidth - 32}
                height={250}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          )}
          {jitter_data && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Jitter</Text>
              <LineChart
                data={createChartData(jitter_data)}
                width={screenWidth - 32}
                height={250}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          )}
          {intensity_analysis && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Intensity Analysis</Text>
              <LineChart
                data={createChartData(intensity_analysis)}
                width={screenWidth - 32}
                height={250}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          )}
          {energy_analysis && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Energy Analysis</Text>
              <LineChart
                data={createChartData(energy_analysis)}
                width={screenWidth - 32}
                height={250}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
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
