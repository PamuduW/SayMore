import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

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
  } = route.params || {};

  const [data, setData] = useState({
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

  useEffect(() => {
    const labelss = Object.keys(pitch_data);
    const dataset = labelss.map(key => pitch_data[key].mean_pitch_ST);

    console.log('Labels:', labelss);
    console.log('Dataset:', dataset);

    setData(prevData => ({
      ...prevData,
      labels: labelss,
      datasets: [
        {
          data: dataset,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    }));
  }, [pitch_data]);

  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('FeedbackScreen', {
      final_public_speaking_score,
      final_public_speaking_feedback,
      voiceBaseFeedback,
      voiceDynamicFeedback,
      speechBaseFeedback,
      speechDynamicFeedback,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Additional Details</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={256}
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        bezier
      />
      <Button title="Next" onPress={handleNext} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AdditionalDetailsScreen;
