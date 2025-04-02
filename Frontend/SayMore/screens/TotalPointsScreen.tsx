import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

interface WatchedVideo {
  videoId: string;
  title: string;
  lessonTitle: string;
  percentageWatched: number;
  thumbnail: string;
  timestamp: string;
  id: string;
}

interface PointsHistoryEntry {
  videoId: string;
  pointsEarned: number;
}

interface GroupedVideoData {
  videoId: string;
  title: string;
  thumbnail: string;
  timesWatched: number;
  lastPercentage: number;
  totalPoints: number;
}

interface HeaderProps {
  theme: string;
  groupedVideos: GroupedVideoData[];
}

/**
 * HeaderComponent displays the header section of the TotalPointsScreen.
 * @param {HeaderProps} props - The properties for the header component.
 * @returns {JSX.Element} The rendered header component.
 */
const HeaderComponent: React.FC<HeaderProps> = ({ theme, groupedVideos }) => {
  const headerDynamicStyles = useMemo(
    () => ({
      sectionTitle: { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
      sectionSubtitle: { color: theme === 'dark' ? '#AAAAAA' : '#718096' },
    }),
    [theme]
  );

  return (
    <View style={styles.headerComponent}>
      <Text style={[styles.sectionTitle, headerDynamicStyles.sectionTitle]}>
        Videos Watched
      </Text>
      <Text
        style={[styles.sectionSubtitle, headerDynamicStyles.sectionSubtitle]}>
        {groupedVideos.length} {groupedVideos.length === 1 ? 'video' : 'videos'}{' '}
        completed
      </Text>
    </View>
  );
};

interface EmptyProps {
  theme: string;
}

/**
 * EmptyListComponent displays a message when there are no videos watched.
 * @param {EmptyProps} props - The properties for the empty list component.
 * @returns {JSX.Element} The rendered empty list component.
 */
const EmptyListComponent: React.FC<EmptyProps> = ({ theme }) => {
  const emptyDynamicStyles = useMemo(
    () => ({
      emptyText: { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
      emptySubtext: { color: theme === 'dark' ? '#AAAAAA' : '#718096' },
    }),
    [theme]
  );

  return (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, emptyDynamicStyles.emptyText]}>
        No videos watched yet
      </Text>
      <Text style={[styles.emptySubtext, emptyDynamicStyles.emptySubtext]}>
        Start watching videos to earn points and enhance your speech &
        confidence.
      </Text>
    </View>
  );
};

/**
 * TotalPointsScreen displays the total points earned by the user and the list of videos watched.
 * @returns {JSX.Element} The rendered TotalPointsScreen component.
 */
const TotalPointsScreen: React.FC = () => {
  const [points, setPoints] = useState<number | null>(null);
  const [groupedVideos, setGroupedVideos] = useState<GroupedVideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { theme } = useTheme();
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

  const dynamicStyles = useMemo(
    () => ({
      cardContainer: {
        borderColor: borderInterpolation,
        borderWidth: 2,
        backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      },
      videoTitle: {
        color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
      },
      progressLabel: {
        color: theme === 'dark' ? '#BBBBBB' : '#718096',
      },
      progressBarBackground: {
        backgroundColor: theme === 'dark' ? '#333333' : '#E2E8F0',
      },
      progressPercentage: {
        color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
      },
      backButton: {
        backgroundColor: theme === 'dark' ? '#333333' : '#E6F7FF',
      },
      headerTextColor: {
        color: theme === 'dark' ? '#FFFFFF' : '#2C3E50',
      },
      pointsCircleBackground: {
        backgroundColor: theme === 'dark' ? '#333333' : '#3B5998',
      },
      contentContainerBackground: {
        backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      },
    }),
    [theme, borderInterpolation]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection('User_Accounts')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            setPoints(data?.points || 0);

            const watchedVideos: WatchedVideo[] = data?.watchedVideos || [];
            const pointsHistory: PointsHistoryEntry[] =
              data?.pointsHistory || [];

            const videoMap: { [key: string]: GroupedVideoData } = {};

            watchedVideos.forEach(video => {
              if (!videoMap[video.videoId]) {
                videoMap[video.videoId] = {
                  videoId: video.videoId,
                  title: video.title,
                  thumbnail: video.thumbnail,
                  timesWatched: 1,
                  lastPercentage: video.percentageWatched,
                  totalPoints: 0,
                };
              } else {
                videoMap[video.videoId].timesWatched += 1;
                videoMap[video.videoId].lastPercentage =
                  video.percentageWatched;
              }
            });

            pointsHistory.forEach(entry => {
              const vidId = entry.videoId;
              if (videoMap[vidId]) {
                videoMap[vidId].totalPoints += entry.pointsEarned;
              }
            });

            setGroupedVideos(Object.values(videoMap));
          } else {
            setPoints(0);
            setGroupedVideos([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPoints(0);
        setGroupedVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  /**
   * Renders a single video item in the list.
   * @param {Object} item - The video item to render.
   * @returns {JSX.Element} The rendered video item.
   */
  const renderVideoItem = ({ item }: { item: GroupedVideoData }) => (
    <Animated.View style={[styles.cardContainer, dynamicStyles.cardContainer]}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <LinearGradient
          colors={
            theme === 'dark'
              ? ['rgba(30, 30, 30, 0.8)', 'rgba(60, 60, 60, 0.8)']
              : ['rgba(59, 89, 152, 0.8)', 'rgba(87, 123, 193, 0.8)']
          }
          style={styles.watchCountBadge}>
          <Text style={styles.watchCountText}>{item.timesWatched}x</Text>
        </LinearGradient>
      </View>

      <View style={styles.videoDetails}>
        <Text
          style={[styles.videoTitle, dynamicStyles.videoTitle]}
          numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressLabel, dynamicStyles.progressLabel]}>
            Last watched:
          </Text>
          <View
            style={[
              styles.progressBarBackground,
              dynamicStyles.progressBarBackground,
            ]}>
            <LinearGradient
              colors={
                theme === 'dark'
                  ? ['#555555', '#777777']
                  : ['#3B5998', '#577BC1']
              }
              style={[
                styles.progressBarFill,
                { width: `${item.lastPercentage}%` },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressPercentage,
              dynamicStyles.progressPercentage,
            ]}>
            {item.lastPercentage}%
          </Text>
        </View>

        <LinearGradient
          colors={
            theme === 'dark' ? ['#333333', '#444444'] : ['#3B5998', '#577BC1']
          }
          style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{item.totalPoints}</Text>
          <Text style={styles.pointsEarnedLabel}>points earned</Text>
        </LinearGradient>
      </View>
    </Animated.View>
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
            <Text
              style={[styles.backButtonText, dynamicStyles.headerTextColor]}>
              ←
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Your Total Points</Text>
          <View style={styles.spacer} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading your progress...</Text>
          </View>
        ) : (
          <>
            <View style={styles.pointsCircleContainer}>
              <Animated.View
                style={[
                  styles.pointsCircleWrapper,
                  { borderColor: borderInterpolation },
                ]}>
                <View
                  style={[
                    styles.pointsCircle,
                    dynamicStyles.pointsCircleBackground,
                  ]}>
                  <Text style={styles.pointsNumber}>{points}</Text>
                  <Text style={styles.pointsLabel}>POINTS</Text>
                </View>
              </Animated.View>
            </View>

            <View
              style={[
                styles.contentContainer,
                dynamicStyles.contentContainerBackground,
              ]}>
              <FlatList
                data={groupedVideos}
                keyExtractor={item => item.videoId}
                renderItem={renderVideoItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <HeaderComponent
                    theme={theme}
                    groupedVideos={groupedVideos}
                  />
                }
                ListEmptyComponent={<EmptyListComponent theme={theme} />}
              />
            </View>
          </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#FFFFFF',
  },
  pointsCircleContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  pointsCircleWrapper: {
    borderWidth: 3,
    borderRadius: 80,
    padding: 5,
    overflow: 'hidden',
  },
  pointsCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pointsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#D0D3E6',
    marginTop: 6,
  },
  // For video cards
  pointsEarnedLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    overflow: 'hidden',
  },
  headerComponent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  // Card styles
  cardContainer: {
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
  thumbnailContainer: {
    position: 'relative',
    width: 120,
    height: 100,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  watchCountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  watchCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  progressContainer: {
    marginVertical: 6,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    alignSelf: 'flex-end',
    fontWeight: '600',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default TotalPointsScreen;
