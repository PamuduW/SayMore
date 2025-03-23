import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../components/ThemeContext';
import { WatchedVideo } from '../types/types';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ProgressScreen = () => {
  const [watchedVideos, setWatchedVideos] = useState<WatchedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation();
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
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();
          const videos = (data?.watchedVideos || []).map((video: any) => ({
            ...video,
          }));

          // Sort by order in the array
          const recentVideos = videos.slice(-10);
          setWatchedVideos(recentVideos);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderVideoItem = ({ item }: { item: WatchedVideo }) => (
    <Animated.View
      style={[
        styles.videoCard,
        {
          borderColor: borderInterpolation,
          borderWidth: 2,
          backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
        }
      ]}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail || 'https://via.placeholder.com/120x100' }}
          style={styles.thumbnail}
        />
        <LinearGradient
          colors={theme === 'dark' ? ['rgba(30, 30, 30, 0.8)', 'rgba(60, 60, 60, 0.8)'] : ['rgba(59, 89, 152, 0.8)', 'rgba(87, 123, 193, 0.8)']}
          style={styles.watchProgressBadge}
        >
          <Text style={styles.watchProgressText}>{item.percentageWatched}%</Text>
        </LinearGradient>
      </View>

      <View style={styles.videoDetails}>
        <Text
          style={[styles.videoTitle, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.lessonTitle, { color: theme === 'dark' ? '#AAAAAA' : '#718096' }]}
          numberOfLines={1}
        >
          {item.lessonTitle}
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBarBackground, { backgroundColor: theme === 'dark' ? '#333333' : '#E2E8F0' }]}
          >
            <LinearGradient
              colors={theme === 'dark' ? ['#555555', '#777777'] : ['#3B5998', '#577BC1']}
              style={[styles.progressBarFill, { width: `${item.percentageWatched}%` }]}
            />
          </View>
        </View>

        <Text
          style={[styles.timestamp, { color: theme === 'dark' ? '#BBBBBB' : '#718096' }]}
        >
          {item.timestamp || 'Recently watched'}
        </Text>
      </View>
    </Animated.View>
  );

  const chartData = {
    // Using empty strings for labels to hide X-axis text
    labels: watchedVideos.map(() => ""),
    datasets: [
      {
        data: watchedVideos.length > 0
          ? watchedVideos.map((video) => video.percentageWatched || 0)
          : [0, 0],
        color: () => theme === 'dark' ? '#777777' : '#577BC1',
      },
    ],
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]}>
        No videos watched yet
      </Text>
      <Text style={[styles.emptySubtext, { color: theme === 'dark' ? '#AAAAAA' : '#718096' }]}>
        Start watching videos to track your progress and improve your speech skills.
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
          <Text style={styles.headerText}>Your Progress</Text>
          <View style={styles.spacer} />
        </View>

        <View style={[styles.contentContainer, { backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.chartSection}>
              <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]}>
                Watch Progress
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme === 'dark' ? '#AAAAAA' : '#718096' }]}>
                {watchedVideos.length} {watchedVideos.length === 1 ? 'video' : 'videos'} tracked
              </Text>

              <Animated.View
                style={[styles.chartContainer, { borderColor: borderInterpolation, borderWidth: 2 }]}
              >
                {watchedVideos.length > 0 ? (
                  <LineChart
                    data={chartData}
                    width={Dimensions.get('window').width - 60}
                    height={220}
                    yAxisSuffix="%"
                    chartConfig={{
                      backgroundColor: theme === 'dark' ? '#333333' : '#3B5998',
                      backgroundGradientFrom: theme === 'dark' ? '#333333' : '#3B5998',
                      backgroundGradientTo: theme === 'dark' ? '#555555' : '#577BC1',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: { borderRadius: 16 },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: theme === 'dark' ? '#AAAAAA' : '#FFFFFF',
                      },
                      hidePointsAtIndex: [...Array(watchedVideos.length).keys()].filter(i => i % 2 !== 0),
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                    withHorizontalLabels={true}
                    withVerticalLabels={false}
                  />
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={{ color: theme === 'dark' ? '#FFFFFF' : '#2A2D57', fontSize: 16, textAlign: 'center' }}>
                      No progress data yet
                    </Text>
                    <Text style={{ color: theme === 'dark' ? '#AAAAAA' : '#718096', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                      Watch videos to see your progress over time
                    </Text>
                  </View>
                )}
              </Animated.View>
            </View>

            <View style={styles.videosSection}>
              <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' }]}>
                Recently Watched
              </Text>

              {watchedVideos.length > 0 ? (
                <FlatList
                  data={watchedVideos}
                  keyExtractor={(item, index) => item.id || index.toString()}
                  renderItem={renderVideoItem}
                  scrollEnabled={false}
                  contentContainerStyle={styles.videosList}
                />
              ) : (
                <EmptyListComponent />
              )}
            </View>
          </ScrollView>
        </View>
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
    paddingTop: 24,
    overflow: 'hidden',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  videosSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  chartContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 8,
    backgroundColor: 'transparent',
  },
  videosList: {
    paddingTop: 8,
  },
  videoCard: {
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
  watchProgressBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  watchProgressText: {
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
    marginBottom: 4,
    lineHeight: 22,
  },
  lessonTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
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
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ProgressScreen;