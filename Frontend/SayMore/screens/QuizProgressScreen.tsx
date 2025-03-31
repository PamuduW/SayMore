import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../components/ThemeContext';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

/**
 * QuizProgressScreen component that displays the user's quiz progress.
 * @returns {JSX.Element} The rendered component.
 */
const QuizProgressScreen = () => {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const theme = useTheme();
  const navigation = useNavigation();
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      })
    ).start();
  }, [borderAnimation]);

  const borderInterpolation = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange:
      theme === 'dark' ? ['#444444', '#AAAAAA'] : ['#2D336B', '#7886C7'],
  });

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const user = auth().currentUser;
        if (!user) return;

        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();
          const attempts = data?.quizAttempts || [];

          attempts.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setQuizAttempts(attempts);
        }
      } catch (error) {
        console.error('Error fetching quiz data', error);
      }
    };

    fetchQuizData();
  }, []);

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  /**
   * Renders a quiz item in the list of quiz attempts.
   * @param {object} item - The quiz item to render.
   * @returns {JSX.Element} The rendered quiz item.
   */
  const renderQuizItem = ({ item }) => (
    <Animated.View
      style={[
        styles.quizCard,
        { borderColor: borderInterpolation },
        theme === 'dark' ? styles.quizCardDark : styles.quizCardLight,
      ]}>
      <View style={styles.quizDetails}>
        <Text
          style={[
            styles.quizTitle,
            theme === 'dark' ? styles.quizTitleDark : styles.quizTitleLight,
          ]}
          numberOfLines={2}>
          {item.quizType} Quiz
        </Text>
        <Text
          style={[
            styles.scoreText,
            theme === 'dark' ? styles.scoreTextDark : styles.scoreTextLight,
          ]}>
          Score: {item.score} / {item.totalPoints}
        </Text>
        <Text
          style={[
            styles.timestamp,
            theme === 'dark' ? styles.timestampDark : styles.timestampLight,
          ]}>
          {item.timestamp || 'N/A'}
        </Text>
      </View>
    </Animated.View>
  );

  const chartData = {
    labels: quizAttempts.map(() => ''), // Hide X-axis labels
    datasets: [
      {
        data: quizAttempts.map(attempt =>
          attempt.totalPoints ? (attempt.score / attempt.totalPoints) * 100 : 0
        ),
        color: () => (theme === 'dark' ? '#777777' : '#577BC1'),
      },
    ],
  };

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#000000', '#121212'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme === 'dark' ? '#000000' : '#577BC1'}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              theme === 'dark' ? styles.backButtonDark : styles.backButtonLight,
            ]}
            onPress={handleBackPress}>
            <Text
              style={[
                styles.backButtonText,
                theme === 'dark'
                  ? styles.backButtonTextDark
                  : styles.backButtonTextLight,
              ]}>
              ←
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Quiz Progress</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.chartSection}>
            <Text
              style={[
                styles.sectionTitle,
                theme === 'dark'
                  ? styles.sectionTitleDark
                  : styles.sectionTitleLight,
              ]}>
              Quiz Performance Over Time
            </Text>
            <Text
              style={[
                styles.sectionSubtitle,
                theme === 'dark'
                  ? styles.sectionSubtitleDark
                  : styles.sectionSubtitleLight,
              ]}>
              {quizAttempts.length}{' '}
              {quizAttempts.length === 1 ? 'attempt' : 'attempts'} recorded
            </Text>
            <Animated.View
              style={[
                styles.chartContainer,
                { borderColor: borderInterpolation },
              ]}>
              {quizAttempts.length > 0 ? (
                <LineChart
                  data={chartData}
                  width={Dimensions.get('window').width - 60}
                  height={220}
                  yAxisSuffix="%"
                  chartConfig={{
                    backgroundColor: theme === 'dark' ? '#333333' : '#3B5998',
                    backgroundGradientFrom:
                      theme === 'dark' ? '#333333' : '#3B5998',
                    backgroundGradientTo:
                      theme === 'dark' ? '#555555' : '#577BC1',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: theme === 'dark' ? '#AAAAAA' : '#FFFFFF',
                    },
                  }}
                  bezier
                  style={styles.chartStyle}
                  withHorizontalLabels={true}
                  withVerticalLabels={false}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text
                    style={[
                      styles.noDataText,
                      theme === 'dark'
                        ? styles.noDataTextDark
                        : styles.noDataTextLight,
                    ]}>
                    No quiz data available
                  </Text>
                  <Text
                    style={[
                      styles.noDataSubtext,
                      theme === 'dark'
                        ? styles.noDataSubtextDark
                        : styles.noDataSubtextLight,
                    ]}>
                    Complete quizzes to track your performance over time.
                  </Text>
                </View>
              )}
            </Animated.View>
          </View>

          <View style={styles.quizzesSection}>
            <Text
              style={[
                styles.sectionTitle,
                theme === 'dark'
                  ? styles.sectionTitleDark
                  : styles.sectionTitleLight,
              ]}>
              Recent Quiz Attempts
            </Text>
            {quizAttempts.length > 0 ? (
              <FlatList
                data={quizAttempts}
                keyExtractor={(item, index) =>
                  item.timestamp ? item.timestamp.toString() : index.toString()
                }
                renderItem={renderQuizItem}
                scrollEnabled={false}
                contentContainerStyle={styles.quizzesList}
              />
            ) : (
              <EmptyListComponent theme={theme} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

/**
 * EmptyListComponent component that displays a message when there are no quiz attempts.
 * @param {object} theme - The current theme (dark or light).
 * @returns {JSX.Element} The rendered component.
 */
const EmptyListComponent = ({ theme }) => (
  <View style={styles.emptyContainer}>
    <Text
      style={[
        styles.emptyText,
        theme === 'dark' ? styles.emptyTextDark : styles.emptyTextLight,
      ]}>
      No quizzes attempted yet
    </Text>
    <Text
      style={[
        styles.emptySubtext,
        theme === 'dark' ? styles.emptySubtextDark : styles.emptySubtextLight,
      ]}>
      Take some quizzes to see your performance history.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonDark: { backgroundColor: '#333333' },
  backButtonLight: { backgroundColor: '#E6F7FF' },
  backButtonText: { fontSize: 28, fontWeight: 'bold' },
  backButtonTextDark: { color: '#FFFFFF' },
  backButtonTextLight: { color: '#2C3E50' },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  spacer: { width: 48 },
  chartSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  sectionTitleDark: { color: '#FFFFFF' },
  sectionTitleLight: { color: '#2A2D57' },
  sectionSubtitle: { fontSize: 16, marginBottom: 16 },
  sectionSubtitleDark: { color: '#AAAAAA' },
  sectionSubtitleLight: { color: '#718096' },
  chartContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: { fontSize: 16, textAlign: 'center' },
  noDataTextDark: { color: '#FFFFFF' },
  noDataTextLight: { color: '#2A2D57' },
  noDataSubtext: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  noDataSubtextDark: { color: '#AAAAAA' },
  noDataSubtextLight: { color: '#718096' },
  quizzesSection: { paddingHorizontal: 20, paddingBottom: 30 },
  quizzesList: { paddingTop: 8 },
  quizCard: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  quizCardDark: { backgroundColor: '#121212' },
  quizCardLight: { backgroundColor: '#FFFFFF' },
  quizDetails: { flex: 1, padding: 12, justifyContent: 'space-between' },
  quizTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  quizTitleDark: { color: '#FFFFFF' },
  quizTitleLight: { color: '#2A2D57' },
  scoreText: { fontSize: 14 },
  scoreTextDark: { color: '#AAAAAA' },
  scoreTextLight: { color: '#718096' },
  timestamp: { fontSize: 12, alignSelf: 'flex-end' },
  timestampDark: { color: '#BBBBBB' },
  timestampLight: { color: '#718096' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyTextDark: { color: '#FFFFFF' },
  emptyTextLight: { color: '#2A2D57' },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  emptySubtextDark: { color: '#AAAAAA' },
  emptySubtextLight: { color: '#718096' },
});

export default QuizProgressScreen;
