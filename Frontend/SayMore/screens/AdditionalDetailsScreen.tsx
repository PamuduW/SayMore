import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

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

/**
 * AdditionalDetailsScreen component that displays various analysis charts and feedback.
 * @param {Object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered component.
 */
const AdditionalDetailsScreen = ({ route }) => {
  const {
    final_public_speaking_score = 0,
    final_public_speaking_feedback = '',
    voiceBaseFeedback = '',
    voiceDynamicFeedback = '',
    speechBaseFeedback = '',
    speechDynamicFeedback = '',
    pitch_data = {},
    hnr_data = {},
    shimmer_data = {},
    jitter_data = {},
    intensity_analysis = {},
    energy_analysis = {},
    threeSmallestScores = [],
  } = route.params || {};

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
    const pitch_labels = Object.keys(pitch_data);
    const pitch_dataset = pitch_labels.map(
      key => pitch_data[key].mean_pitch_ST
    );

    const hnr_labels = Object.keys(hnr_data);
    const hnr_dataset = hnr_labels.map(key => hnr_data[key]);

    const shimmer_labels = Object.keys(shimmer_data);
    const shimmer_dataset = shimmer_labels.map(key => shimmer_data[key]);

    const jitter_labels = Object.keys(jitter_data);
    const jitter_dataset = jitter_labels.map(key => jitter_data[key]);

    const intensity_labels = Object.keys(intensity_analysis);
    const intensity_dataset = intensity_labels.map(
      key => intensity_analysis[key]
    );

    const energy_labels = Object.keys(energy_analysis);
    const energy_dataset = energy_labels.map(key => energy_analysis[key]);

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
  }, [
    pitch_data,
    hnr_data,
    shimmer_data,
    jitter_data,
    intensity_analysis,
    energy_analysis,
  ]);

  const navigation = useNavigation();

  /**
   * Navigates to the FeedbackScreen_PS with the provided parameters.
   */
  const handleNext = () => {
    navigation.navigate('FeedbackScreen_PS', {
      final_public_speaking_score,
      final_public_speaking_feedback,
      voiceBaseFeedback,
      voiceDynamicFeedback,
      speechBaseFeedback,
      speechDynamicFeedback,
      threeSmallestScores,
    });
  };

  /**
   * Navigates back to the previous screen.
   */
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButtonContainer}>
        <Image
          source={require('../assets/back.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#002244',
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
    borderRadius: 10,
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

export default AdditionalDetailsScreen;
