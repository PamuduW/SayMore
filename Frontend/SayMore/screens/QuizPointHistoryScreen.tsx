import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  const borderAnimation = useRef(new Animated.Value(0)).current;

  // Animation for border
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

  // Memoize constant maps so that they can be added to dependency arrays without triggering unnecessary rerenders.
  const difficultyMap = useMemo(
    () => ({
      Set: 'Easy',
      Set_2: 'Intermediate',
      Set_3: 'Hard',
      Easy: 'Easy',
      Intermediate: 'Intermediate',
      Hard: 'Hard',
    }),
    []
  );

  const setMappings = useMemo(
    () => ({
      set1: 'Relaxation Techniques',
      set2: 'Speech Techniques',
      set3: 'Pronunciation',
      'relaxation techniques': 'Relaxation Techniques',
      'speech techniques': 'Speech Techniques',
      pronunciation: 'Pronunciation',
      'Relaxation Techniques': 'Relaxation Techniques',
      'Speech Techniques': 'Speech Techniques',
      Pronunciation: 'Pronunciation',
    }),
    []
  );

  // Dynamic styles extracted from inline definitions
  const dynamicStyles = useMemo(
    () => ({
      attemptCard: {
        backgroundColor: theme === 'dark' ? '#1C1C1C' : '#FFFFFF',
        borderColor: borderInterpolation,
        borderWidth: 2,
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
      attemptText: {
        color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
      },
      tagText: {
        color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
      },
      sectionTitleText: {
        color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
      },
      dateText: {
        color: theme === 'dark' ? '#888' : '#718096',
      },
      backButton: {
        backgroundColor: theme === 'dark' ? '#333333' : '#E6F7FF',
      },
      backButtonText: {
        color: theme === 'dark' ? '#FFFFFF' : '#2C3E50',
      },
      headerTitle: {
        color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
      },
      headerSubtitle: {
        color: theme === 'dark' ? '#AAAAAA' : '#718096',
      },
      iconContainerGradient:
        theme === 'dark' ? ['#333333', '#444444'] : ['#3B5998', '#577BC1'],
      listContent: {
        backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
        opacity: fadeAnim,
      },
    }),
    [theme, fadeAnim, borderInterpolation]
  );

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
        // eslint-disable-next-line no-console
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

    // Include memoized dependencies in the dependency array.
    fetchQuizAttempts();
  }, [fadeAnim, difficultyMap, setMappings]);

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

  // Removed unused index parameter.
  const renderAttemptItem = ({ item }: { item: QuizAttempt }) => {
    const scoreColor = getScoreColor(item.score, item.totalPoints);

    return (
      <Animated.View style={[styles.attemptCard, dynamicStyles.attemptCard]}>
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
            <Text style={[styles.attemptText, dynamicStyles.attemptText]}>
              {item.quizType === 'Public Speaking'
                ? 'Public Speaking Quiz'
                : 'Stuttering Quiz'}
            </Text>

            <View style={styles.tagContainer}>
              {item.quizType === 'Public Speaking' && item.difficulty && (
                <LinearGradient
                  colors={dynamicStyles.iconContainerGradient}
                  style={styles.tagBackground}>
                  <Text style={[styles.tagText, dynamicStyles.tagText]}>
                    {item.difficulty}
                  </Text>
                </LinearGradient>
              )}

              {item.quizType === 'Stuttering' && item.set && (
                <LinearGradient
                  colors={dynamicStyles.iconContainerGradient}
                  style={styles.tagBackground}>
                  <Text style={[styles.tagText, dynamicStyles.tagText]}>
                    {item.set}
                  </Text>
                </LinearGradient>
              )}
            </View>
          </View>
        </View>

        <View
          style={[
            styles.cardFooter,
            theme === 'dark' ? styles.cardFooterDark : styles.cardFooterLight,
          ]}>
          <Text style={[styles.attemptDate, dynamicStyles.dateText]}>
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
      <LinearGradient
        colors={dynamicStyles.iconContainerGradient}
        style={styles.iconContainer}>
        <Text style={styles.sectionIcon}>{getQuizIcon(title)}</Text>
      </LinearGradient>
      <Text style={[styles.quizTypeTitle, dynamicStyles.sectionTitleText]}>
        {title} Quizzes
      </Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Animated.View
        style={[
          styles.emptyIconContainer,
          { borderColor: borderInterpolation },
        ]}>
        <Text style={styles.emptyIcon}>📝</Text>
      </Animated.View>
      <Text style={[styles.emptyText, dynamicStyles.sectionTitleText]}>
        No quiz attempts yet
      </Text>
      <Text
        style={[
          styles.emptySubtext,
          theme === 'dark' ? styles.emptySubtextDark : styles.emptySubtextLight,
        ]}>
        Complete quizzes to track your progress here.
      </Text>
    </View>
  );

  const headerComponent = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>
        Quiz Performance
      </Text>
      <Text style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
        {sectionData.reduce((total, section) => total + section.data.length, 0)}{' '}
        attempts total
      </Text>
    </View>
  );

  const loadingComponent = () => (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[styles.loadingCircle, { borderColor: borderInterpolation }]}>
        <LinearGradient
          colors={dynamicStyles.iconContainerGradient}
          style={styles.loadingInnerCircle}>
          <Text style={styles.loadingIcon}>📊</Text>
        </LinearGradient>
      </Animated.View>
      <Text style={styles.loadingText}>Loading your quiz history...</Text>
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
            style={[styles.backButton, dynamicStyles.backButton]}
            onPress={handleBackPress}>
            <Text style={[styles.backButtonText, dynamicStyles.backButtonText]}>
              ←
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Quiz History</Text>
          <View style={styles.spacer} />
        </View>

        {loading ? (
          loadingComponent()
        ) : (
          <Animated.View
            style={[styles.contentContainer, dynamicStyles.listContent]}>
            <SectionList
              sections={sectionData}
              keyExtractor={(item, index) => item.quizType + index}
              renderItem={renderAttemptItem}
              renderSectionHeader={renderSectionHeader}
              ListEmptyComponent={renderEmptyComponent}
              ListHeaderComponent={headerComponent}
              contentContainerStyle={[
                styles.listContainer,
                sectionData.length === 0 && styles.centeredContent,
              ]}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
                { useNativeDriver: false }
              )}
            />
          </Animated.View>
        )}
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
    fontSize: 24,
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
    paddingTop: 24,
  },
  listContainer: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  listHeader: {
    paddingBottom: 16,
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionIcon: {
    fontSize: 20,
  },
  quizTypeTitle: {
    fontSize: 22,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  attemptText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBackground: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  attemptDate: {
    fontSize: 14,
  },
  percentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
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
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
  },
  emptyIcon: {
    fontSize: 36,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    padding: 5,
  },
  loadingInnerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingIcon: {
    fontSize: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cardFooterDark: {
    borderTopColor: '#333333',
  },
  cardFooterLight: {
    borderTopColor: '#EEEEEE',
  },
  emptySubtextDark: {
    color: '#AAAAAA',
  },
  emptySubtextLight: {
    color: '#718096',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default QuizPointHistoryScreen;
