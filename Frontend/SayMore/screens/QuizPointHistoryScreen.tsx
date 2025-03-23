import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  SectionList,
  Animated,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

interface QuizAttempt {
  quizType: string;
  difficulty?: string; // For Public Speaking
  set?: string; // For Stuttering
  score: number;
  totalPoints: number;
  timestamp: string;
}

interface SectionData {
  title: string;
  data: QuizAttempt[];
}

const QuizPointHistoryScreen: React.FC = ({ navigation }: any) => {
  const [sectionData, setSectionData] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // Define mappings for quiz difficulties and sets
  const difficultyMap = {
    Set: 'Easy',
    Set_2: 'Intermediate',
    Set_3: 'Hard',
    Easy: 'Easy',
    Intermediate: 'Intermediate',
    Hard: 'Hard',
  };

  const setMappings = {
    set1: 'Relaxation Techniques',
    set2: 'Speech Techniques',
    set3: 'Pronunciation',
    'relaxation techniques': 'Relaxation Techniques',
    'speech techniques': 'Speech Techniques',
    pronunciation: 'Pronunciation',
    'Relaxation Techniques': 'Relaxation Techniques',
    'Speech Techniques': 'Speech Techniques',
    Pronunciation: 'Pronunciation',
  };

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection('User_Accounts')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            const attempts: QuizAttempt[] = data?.quizAttempts || [];

            // Process the attempts to ensure proper naming
            const processedAttempts = attempts.map(attempt => {
              const processedAttempt = { ...attempt };

              // Process Public Speaking difficulty names
              if (
                attempt.quizType === 'Public Speaking' &&
                attempt.difficulty
              ) {
                processedAttempt.difficulty =
                  difficultyMap[
                    attempt.difficulty as keyof typeof difficultyMap
                  ] || attempt.difficulty;
              }

              // Process Stuttering set names
              if (attempt.quizType === 'Stuttering' && attempt.set) {
                processedAttempt.set =
                  setMappings[
                    attempt.set.toLowerCase() as keyof typeof setMappings
                  ] || attempt.set.replace(/\b\w/g, c => c.toUpperCase());
              }

              return processedAttempt;
            });

            // Sort attempts by timestamp (newest first)
            const sortedAttempts = [...processedAttempts].sort(
              (a, b) =>
                moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf()
            );

            // Grouping attempts by quizType
            const grouped = sortedAttempts.reduce(
              (acc: { [key: string]: QuizAttempt[] }, attempt) => {
                const { quizType } = attempt;
                if (!acc[quizType]) {
                  acc[quizType] = [];
                }
                acc[quizType].push(attempt);
                return acc;
              },
              {}
            );

            // Formatting data for SectionList
            const formattedData: SectionData[] = Object.keys(grouped).map(
              quizType => ({
                title: quizType,
                data: grouped[quizType],
              })
            );

            setSectionData(formattedData);
          }
        }
      } catch (error) {
        console.error('Error fetching quiz attempts:', error);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    };

    fetchQuizAttempts();
  }, [fadeAnim]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return theme === 'dark' ? '#4CAF50' : '#388E3C';
    if (percentage >= 60) return theme === 'dark' ? '#FFC107' : '#FFA000';
    return theme === 'dark' ? '#F44336' : '#D32F2F';
  };

  const getQuizIcon = (quizType: string) => {
    switch (quizType) {
      case 'Public Speaking':
        return '🎤';
      case 'Stuttering':
        return '🗣️';
      default:
        return '📝';
    }
  };

  const renderAttemptItem = ({
    item,
    index,
  }: {
    item: QuizAttempt;
    index: number;
  }) => {
    const scoreColor = getScoreColor(item.score, item.totalPoints);

    return (
      <Animated.View
        style={[
          styles.attemptCard,
          {
            backgroundColor: theme === 'dark' ? '#1C1C1C' : '#FFFFFF',
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.cardHeader}>
          <View style={styles.scoreContainer}>
            <LinearGradient
              colors={
                theme === 'dark'
                  ? [scoreColor, scoreColor + '99']
                  : [scoreColor, scoreColor + 'CC']
              }
              style={styles.scoreCircle}>
              <Text style={styles.scoreText}>
                {item.score}/{item.totalPoints}
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.detailsContainer}>
            <Text
              style={[
                styles.attemptText,
                { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
              ]}>
              {item.quizType === 'Public Speaking'
                ? 'Public Speaking Quiz'
                : 'Stuttering Quiz'}
            </Text>

            {item.quizType === 'Public Speaking' && item.difficulty && (
              <View style={styles.tagContainer}>
                <Text
                  style={[
                    styles.tagText,
                    {
                      backgroundColor: theme === 'dark' ? '#333333' : '#EAEEFF',
                    },
                  ]}>
                  {item.difficulty}
                </Text>
              </View>
            )}

            {item.quizType === 'Stuttering' && item.set && (
              <View style={styles.tagContainer}>
                <Text
                  style={[
                    styles.tagText,
                    {
                      backgroundColor: theme === 'dark' ? '#333333' : '#EAEEFF',
                    },
                  ]}>
                  {item.set}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text
            style={[
              styles.attemptDate,
              { color: theme === 'dark' ? '#888' : '#718096' },
            ]}>
            {moment(item.timestamp).format('MMM Do YYYY, h:mm A')}
          </Text>

          <LinearGradient
            colors={
              theme === 'dark' ? ['#333333', '#444444'] : ['#3B5998', '#577BC1']
            }
            style={styles.percentContainer}>
            <Text style={styles.percentText}>
              {Math.round((item.score / item.totalPoints) * 100)}%
            </Text>
          </LinearGradient>
        </View>
      </Animated.View>
    );
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={styles.sectionHeaderContainer}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme === 'dark' ? '#333333' : '#EAEEFF' },
        ]}>
        <Text style={styles.sectionIcon}>{getQuizIcon(title)}</Text>
      </View>
      <Text
        style={[
          styles.quizTypeTitle,
          { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
        ]}>
        {title} Quizzes
      </Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text
        style={[
          styles.emptyText,
          { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
        ]}>
        No quiz attempts yet
      </Text>
      <Text
        style={[
          styles.emptySubtext,
          { color: theme === 'dark' ? '#AAAAAA' : '#718096' },
        ]}>
        Complete quizzes to track your progress here.
      </Text>
    </View>
  );

  const headerComponent = () => (
    <View style={styles.listHeader}>
      <Text
        style={[
          styles.headerTitle,
          { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
        ]}>
        Quiz Performance
      </Text>
      <Text
        style={[
          styles.headerSubtitle,
          { color: theme === 'dark' ? '#AAAAAA' : '#718096' },
        ]}>
        {sectionData.reduce((total, section) => total + section.data.length, 0)}{' '}
        attempts total
      </Text>
    </View>
  );

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
              { backgroundColor: theme === 'dark' ? '#333333' : '#E6F7FF' },
            ]}
            onPress={handleBackPress}>
            <Text
              style={[
                styles.backButtonText,
                { color: theme === 'dark' ? '#FFFFFF' : '#2C3E50' },
              ]}>
              ←
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Quiz History</Text>
          <View style={styles.spacer} />
        </View>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              backgroundColor: theme === 'dark' ? '#121212' : '#F5F8FF',
              opacity: fadeAnim,
            },
          ]}>
          <SectionList
            sections={sectionData}
            keyExtractor={(item, index) => item.quizType + index}
            renderItem={renderAttemptItem}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={renderEmptyComponent}
            ListHeaderComponent={headerComponent}
            contentContainerStyle={[
              styles.listContainer,
              sectionData.length === 0 && { flex: 1, justifyContent: 'center' },
            ]}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
              { useNativeDriver: false }
            )}
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
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
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  spacer: {
    width: 48,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  listContainer: {
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  listHeader: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  quizTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  attemptCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  scoreContainer: {
    marginRight: 16,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  attemptText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagText: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  attemptDate: {
    fontSize: 14,
  },
  attemptSubText: {
    marginTop: 4,
    fontSize: 14,
  },
  percentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  percentText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default QuizPointHistoryScreen;
