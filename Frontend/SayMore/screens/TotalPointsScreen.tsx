import React, { useEffect, useState, useRef } from 'react';
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

const TotalPointsScreen: React.FC = () => {
  const [points, setPoints] = useState<number | null>(null);
  const [groupedVideos, setGroupedVideos] = useState<GroupedVideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const theme = useTheme();
  const borderAnimation = useRef(new Animated.Value(0)).current;

  // Animation
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
    outputRange: theme === 'dark' ? ['#444444', '#AAAAAA'] : ['#2D336B', '#7886C7'],
  });

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
            const pointsHistory: PointsHistoryEntry[] = data?.pointsHistory || [];

            const videoMap: { [key: string]: GroupedVideoData } = {};

            // Group watched videos by videoId
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
                videoMap[video.videoId].lastPercentage = video.percentageWatched;
              }
            });

            // Sum points for each video from pointsHistory
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

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderVideoItem = ({ item }: { item: GroupedVideoData }) => (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          borderColor: borderInterpolation,
          borderWidth: 2,
          backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
        }
      ]}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <LinearGradient
          colors={theme === 'dark' ? ['rgba(30, 30, 30, 0.8)', 'rgba(60, 60, 60, 0.8)'] : ['rgba(59, 89, 152, 0.8)', 'rgba(87, 123, 193, 0.8)']}
          style={styles.watchCountBadge}
        >
          <Text style={styles.watchCountText}>{item.timesWatched}x</Text>
        </LinearGradient>
      </View>

      <View style={styles.videoDetails}>
        <Text style={[styles.videoTitle, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressLabel, { color: theme === 'dark' ? '#BBBBBB' : '#718096' }]}>Last watched:</Text>
          <View style={[styles.progressBarBackground, { backgroundColor: theme === 'dark' ? '#333333' : '#E2E8F0' }]}>
            <LinearGradient
              colors={theme === 'dark' ? ['#555555', '#777777'] : ['#3B5998', '#577BC1']}
              style={[styles.progressBarFill, { width: `${item.lastPercentage}%` }]}
            />
          </View>
          <Text style={[styles.progressPercentage, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]}>
            {item.lastPercentage}%
          </Text>
        </View>

        <LinearGradient
          colors={theme === 'dark' ? ['#333333', '#444444'] : ['#3B5998', '#577BC1']}
          style={styles.pointsContainer}
        >
          <Text style={styles.pointsValue}>{item.totalPoints}</Text>
          <Text style={styles.pointsLabel}>points earned</Text>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const HeaderComponent = () => (
    <View style={styles.headerComponent}>
      <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]}>
        Videos Watched
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme === 'dark' ? '#AAAAAA' : '#718096' }]}>
        {groupedVideos.length} {groupedVideos.length === 1 ? 'video' : 'videos'} completed
      </Text>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]}>
        No videos watched yet
      </Text>
      <Text style={[styles.emptySubtext, { color: theme === 'dark' ? '#AAAAAA' : '#718096' }]}>
        Start watching videos to earn points and enhance your speech & confidence.
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#000000', '#121212'] : ['#577BC1', '#577BC1']}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme === 'dark' ? '#000000' : '#577BC1'}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme === 'dark' ? '#333333' : '#E6F7FF' }]}
            onPress={handleBackPress}
          >
            <Text style={[styles.backButtonText, { color: theme === 'dark' ? '#FFFFFF' : '#2C3E50' }]}>←</Text>
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
              <Animated.View style={[styles.pointsCircleWrapper, { borderColor: borderInterpolation }]}>
                <View style={[styles.pointsCircle, { backgroundColor: theme === 'dark' ? '#333333' : '#3B5998' }]}>
                  <Text style={styles.pointsNumber}>{points}</Text>
                  <Text style={styles.pointsLabel}>POINTS</Text>
                </View>
              </Animated.View>
            </View>

            <View style={[styles.contentContainer, { backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }]}>
              <FlatList
                data={groupedVideos}
                keyExtractor={item => item.videoId}
                renderItem={renderVideoItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={HeaderComponent}
                ListEmptyComponent={EmptyListComponent}
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

  // Card Design
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
  pointsLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
});

export default TotalPointsScreen;