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

/**
 * ProgressScreen component that displays the user's progress in watching videos.
 * @returns {JSX.Element} The rendered component.
 */
const ProgressScreen = () => {
  const [watchedVideos, setWatchedVideos] = useState<WatchedVideo[]>([]);
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
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
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

          const recentVideos = videos.slice(-10);
          setWatchedVideos(recentVideos);
        }
      } catch (error) {
        Alert.alert('Error', 'Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  /**
   * Renders a video item in the list of watched videos.
   * @param {object} item - The video item to render.
   * @returns {JSX.Element} The rendered video item.
   */
  const renderVideoItem = ({ item }: { item: WatchedVideo }) => (
    <Animated.View
      style={[
        styles.videoCard,
        {
          borderColor: borderInterpolation,
        },
        theme === 'dark' ? styles.videoCardDark : styles.videoCardLight,
      ]}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{
            uri: item.thumbnail || 'https://via.placeholder.com/120x100',
          }}
          style={styles.thumbnail}
        />
        <LinearGradient
          colors={
            theme === 'dark'
              ? ['rgba(30, 30, 30, 0.8)', 'rgba(60, 60, 60, 0.8)']
              : ['rgba(59, 89, 152, 0.8)', 'rgba(87, 123, 193, 0.8)']
          }
          style={styles.watchProgressBadge}>
          <Text style={styles.watchProgressText}>
            {item.percentageWatched}%
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.videoDetails}>
        <Text
          style={[
            styles.videoTitle,
            theme === 'dark' ? styles.videoTitleDark : styles.videoTitleLight,
          ]}
          numberOfLines={2}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.lessonTitle,
            theme === 'dark' ? styles.lessonTitleDark : styles.lessonTitleLight,
          ]}
          numberOfLines={1}>
          {item.lessonTitle}
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBarBackground,
              theme === 'dark'
                ? styles.progressBarBackgroundDark
                : styles.progressBarBackgroundLight,
            ]}>
            <LinearGradient
              colors={
                theme === 'dark'
                  ? ['#555555', '#777777']
                  : ['#3B5998', '#577BC1']
              }
              style={[
                styles.progressBarFill,
                { width: `${item.percentageWatched}%` },
              ]}
            />
          </View>
        </View>

        <Text
          style={[
            styles.timestamp,
            theme === 'dark' ? styles.timestampDark : styles.timestampLight,
          ]}>
          {item.timestamp || 'Recently watched'}
        </Text>
      </View>
    </Animated.View>
  );

  const chartData = {
    labels: watchedVideos.map(() => ''),
    datasets: [
      {
        data:
          watchedVideos.length > 0
            ? watchedVideos.map(video => video.percentageWatched || 0)
            : [0, 0],
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
          <Text style={styles.headerText}>Your Progress</Text>
          <View style={styles.spacer} />
        </View>

        <View
          style={[
            styles.contentContainer,
            theme === 'dark'
              ? styles.contentContainerDark
              : styles.contentContainerLight,
          ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.chartSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  theme === 'dark'
                    ? styles.sectionTitleDark
                    : styles.sectionTitleLight,
                ]}>
                Watch Progress
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  theme === 'dark'
                    ? styles.sectionSubtitleDark
                    : styles.sectionSubtitleLight,
                ]}>
                {watchedVideos.length}{' '}
                {watchedVideos.length === 1 ? 'video' : 'videos'} tracked
              </Text>

              <Animated.View
                style={[
                  styles.chartContainer,
                  { borderColor: borderInterpolation },
                ]}>
                {watchedVideos.length > 0 ? (
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
                      hidePointsAtIndex: [
                        ...Array(watchedVideos.length).keys(),
                      ].filter(i => i % 2 !== 0),
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
                      No progress data yet
                    </Text>
                    <Text
                      style={[
                        styles.noDataSubtext,
                        theme === 'dark'
                          ? styles.noDataSubtextDark
                          : styles.noDataSubtextLight,
                      ]}>
                      Watch videos to see your progress over time
                    </Text>
                  </View>
                )}
              </Animated.View>
            </View>

            <View style={styles.videosSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  theme === 'dark'
                    ? styles.sectionTitleDark
                    : styles.sectionTitleLight,
                ]}>
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
                <EmptyListComponent theme={theme} />
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

/**
 * EmptyListComponent component that displays a message when there are no watched videos.
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
      No videos watched yet
    </Text>
    <Text
      style={[
        styles.emptySubtext,
        theme === 'dark' ? styles.emptySubtextDark : styles.emptySubtextLight,
      ]}>
      Start watching videos to track your progress and improve your speech
      skills.
    </Text>
  </View>
);

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
  backButtonDark: {
    backgroundColor: '#333333',
  },
  backButtonLight: {
    backgroundColor: '#E6F7FF',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  backButtonTextDark: {
    color: '#FFFFFF',
  },
  backButtonTextLight: {
    color: '#2C3E50',
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
  contentContainerDark: {
    backgroundColor: '#121212',
  },
  contentContainerLight: {
    backgroundColor: '#FFFFFF',
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
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionTitleLight: {
    color: '#2A2D57',
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionSubtitleDark: {
    color: '#AAAAAA',
  },
  sectionSubtitleLight: {
    color: '#718096',
  },
  chartContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
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
  videoCardDark: {
    backgroundColor: '#121212',
  },
  videoCardLight: {
    backgroundColor: '#FFFFFF',
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
  videoTitleDark: {
    color: '#FFFFFF',
  },
  videoTitleLight: {
    color: '#2A2D57',
  },
  lessonTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  lessonTitleDark: {
    color: '#AAAAAA',
  },
  lessonTitleLight: {
    color: '#718096',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarBackgroundDark: {
    backgroundColor: '#333333',
  },
  progressBarBackgroundLight: {
    backgroundColor: '#E2E8F0',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  timestampDark: {
    color: '#BBBBBB',
  },
  timestampLight: {
    color: '#718096',
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
  emptyTextDark: {
    color: '#FFFFFF',
  },
  emptyTextLight: {
    color: '#2A2D57',
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  emptySubtextDark: {
    color: '#AAAAAA',
  },
  emptySubtextLight: {
    color: '#718096',
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noDataTextDark: {
    color: '#FFFFFF',
  },
  noDataTextLight: {
    color: '#2A2D57',
  },
  noDataSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  noDataSubtextDark: {
    color: '#AAAAAA',
  },
  noDataSubtextLight: {
    color: '#718096',
  },
});

export default ProgressScreen;
