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
const parentViewWidth = screenWidth - 70;

const TestHistory_S: React.FC = () => {
  const route = useRoute<any>();
  const { testId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [responseData, setResponseData] = useState<any>(null);
  const [data, setData] = useState({
    labels: ['Fluency', 'Confidence', 'Stuttering'],
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
        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          const stutteringData = userData?.results?.Stuttering_Check;
          if (stutteringData && stutteringData[testId]) {
            setResponseData(stutteringData[testId]);
            setData({
              labels: ['Fluency', 'Confidence', 'Stuttering'],
              data: [
                stutteringData[testId].fluency_score / 100,
                stutteringData[testId].confidence_score / 100,
                stutteringData[testId].stuttering_score / 100,
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
        colors={theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Your Stuttering Analysis</Text>
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

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Stuttering score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.stuttering_score}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Confidence score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.confidence_score}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Fluency score</Text>
              <Text style={styles.valueHighlight}>
                {responseData.fluency_score}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Language</Text>
              <Text style={styles.valueHighlight}>
                {responseData.language}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Stutter count</Text>
              <Text style={styles.valueHighlight}>
                {responseData.stutter_count}
              </Text>
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Stuttered words</Text>
              {responseData.stuttered_words.map((item, index) => (
                <View key={index}>
                  <Text style={styles.label}> </Text>
                  <Text style={styles.value}>Word: {item.word}</Text>
                  <Text style={styles.value}>Type: {item.type}</Text>
                </View>
              ))}
            </View>

            <View style={styles.feedbackBlock}>
              <Text style={styles.label}>Transcript</Text>
              <Text style={styles.value}>{responseData.transcript}</Text>
            </View>

          <View style={styles.feedbackBlock}>
            <Text style={styles.label}>Dynamic Feedback</Text>
            <Text style={styles.value}>{responseData.dynamic_feedback}</Text>
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
    value: {
      fontSize: 16,
      color: '#D0D3E6',
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
  valueHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
});

export default TestHistory_S;