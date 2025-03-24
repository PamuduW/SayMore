import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { VideoItem, WatchedVideo } from '../types/types';

interface LessonRedirectionStutteringProps {}

// Get the width of the window
const { width } = Dimensions.get('window');
// Calculate the width of each video box
const videoBoxWidth = (width - 75) / 3;
// Set the margin for each video box
const videoBoxMargin = 15;
// Set the padding for the container
const containerPadding = 20;

/**
 * LessonRedirectionStuttering component that displays the last watched video and recommended lessons for stuttering.
 * @returns {JSX.Element} The rendered component.
 */
const LessonRedirectionStuttering: React.FC<LessonRedirectionStutteringProps> = () => {
  const navigation = useNavigation();
  const [lastWatchedVideo, setLastWatchedVideo] = useState<WatchedVideo | null>(null);
  const [recommendedLessons, setRecommendedLessons] = useState<
    {
      category: string;
      documentId: string;
      videos: VideoItem[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the last watched video from Firestore.
   */
  const fetchLastWatchedVideo = useCallback(async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        setLastWatchedVideo(null);
        return;
      }

      const userDoc = await firestore()
        .collection('User_Accounts')
        .doc(user.uid)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const watchedVideos = userData?.watchedVideos as WatchedVideo[];

        if (watchedVideos && watchedVideos.length > 0) {
          const sortedVideos = [...watchedVideos]
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .reverse();

          setLastWatchedVideo(sortedVideos[0] || null);
        } else {
          setLastWatchedVideo(null);
        }
      } else {
        setLastWatchedVideo(null);
      }
    } catch (error) {
      setLastWatchedVideo(null);
    }
  }, []);

  /**
   * Fetches the details of a specific video from Firestore.
   * @param {string} videoId - The ID of the video to fetch details for.
   * @param {string} _lessonTitle - The title of the lesson.
   * @returns {Promise<VideoItem | null>} The video details.
   */
  const fetchVideoDetails = useCallback(
    async (
      videoId: string,
      _lessonTitle: string
    ): Promise<VideoItem | null> => {
      try {
        const lessonsSnapshot = await firestore()
          .collection('lesson_videos')
          .get();

        for (const doc of lessonsSnapshot.docs) {
          const lessonData = doc.data();
          if (lessonData.videos) {
            const video = lessonData.videos.find(
              (v: any) => v.videoId === videoId
            );
            if (video) {
              return video as VideoItem;
            }
          }
        }

        return null;
      } catch (error) {
        return null;
      }
    },
    []
  );

  useEffect(() => {
    /**
     * Fetches recommended lessons from Firestore.
     */
    const fetchRecommendedLessons = async () => {
      try {
        const stutteringLessons = [
          { title: 'Speech Exercises', documentId: 'speech_exercises' },
          {
            title: 'Understanding Stuttering',
            documentId: 'understanding_stuttering',
          },
          { title: 'Building Confidence', documentId: 'building_confidence' },
          {
            title: 'Overcoming Stuttering',
            documentId: 'overcoming_stuttering',
          },
        ];

        const lessonsWithVideos = [];

        for (const lesson of stutteringLessons) {
          const documentSnapshot = await firestore()
            .collection('lesson_videos')
            .doc(lesson.documentId)
            .get();

          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            if (data?.videos && data.videos.length > 0) {
              lessonsWithVideos.push({
                category: lesson.title,
                documentId: lesson.documentId,
                videos: data.videos,
              });
            }
          }
        }

        setRecommendedLessons(lessonsWithVideos);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    /**
     * Loads data including last watched video and recommended lessons.
     */
    const loadData = async () => {
      setLoading(true);
      await fetchLastWatchedVideo();
      await fetchRecommendedLessons();
      setLoading(false);
    };

    loadData();
  }, [fetchLastWatchedVideo]);

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  /**
   * Handles the press event on a video item to navigate to the VideoPlayer screen.
   * @param {VideoItem} video - The video item that was pressed.
   * @param {string} _lessonTitle - The title of the lesson.
   * @param {string} _documentId - The document ID of the lesson.
   */
  const handleVideoPress = (
    video: VideoItem,
    _lessonTitle: string,
    _documentId: string
  ) => {
    navigation.navigate('VideoPlayer', {
      video,
      lessonTitle: _lessonTitle,
    });
  };

  /**
   * Formats a date string to a readable format.
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return dateString;
    }
  };

  /**
   * Handles the press event on the last watched video to navigate to the VideoPlayer screen.
   */
  const handleLastWatchedPress = useCallback(async () => {
    if (lastWatchedVideo) {
      setLoading(true);
      try {
        const videoDetails = await fetchVideoDetails(
          lastWatchedVideo.videoId,
          lastWatchedVideo.lessonTitle
        );

        if (videoDetails) {
          navigation.navigate('VideoPlayer', {
            video: videoDetails,
            lessonTitle: lastWatchedVideo.lessonTitle,
          });
        } else {
          navigation.navigate('VideoPlayer', {
            video: {
              videoId: lastWatchedVideo.videoId,
              title: lastWatchedVideo.title,
              thumbnail: lastWatchedVideo.thumbnail,
            },
            lessonTitle: lastWatchedVideo.lessonTitle,
          });
        }
      } catch (error) {
        navigation.navigate('VideoPlayer', {
          video: {
            videoId: lastWatchedVideo.videoId,
            title: lastWatchedVideo.title,
            thumbnail: lastWatchedVideo.thumbnail,
          },
          lessonTitle: lastWatchedVideo.lessonTitle,
        });
      } finally {
        setLoading(false);
      }
    }
  }, [navigation, lastWatchedVideo, fetchVideoDetails]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Stuttering</Text>
            </View>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading content...</Text>
          ) : (
            <>
              {lastWatchedVideo ? (
                <View style={styles.lastWatchedContainer}>
                  <Text style={styles.sectionTitle}>Continue Watching</Text>
                  <TouchableOpacity
                    style={styles.lastWatchedContent}
                    onPress={handleLastWatchedPress}>
                    <Image
                      source={{ uri: lastWatchedVideo.thumbnail }}
                      style={styles.lastWatchedThumbnail}
                      resizeMode="cover"
                    />
                    <View style={styles.lastWatchedInfo}>
                      <Text style={styles.lastWatchedTitle} numberOfLines={2}>
                        {lastWatchedVideo.title}
                      </Text>
                      <Text style={styles.lastWatchedSubtitle}>
                        {lastWatchedVideo.lessonTitle}
                      </Text>
                      <Text style={styles.lastWatchedTimestamp}>
                        {formatDate(lastWatchedVideo.timestamp)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.noLastWatchedContainer}>
                  <Text style={styles.noLastWatchedText}>
                    No videos watched yet. Start watching to see your history!
                  </Text>
                </View>
              )}

              <View style={styles.recommendedContainer}>
                <Text style={styles.recommendedTitle}>
                  Lessons You Might Be Interested In
                </Text>

                {recommendedLessons.length > 0 ? (
                  <>
                    {recommendedLessons.map((lessonCategory, categoryIndex) => (
                      <View
                        key={categoryIndex}
                        style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>
                          {lessonCategory.category}
                        </Text>
                        <View style={styles.videosGrid}>
                          {lessonCategory.videos.map((video, videoIndex) => (
                            <TouchableOpacity
                              key={videoIndex}
                              style={[
                                styles.videoBox,
                                {
                                  width: videoBoxWidth,
                                  marginRight: videoBoxMargin,
                                },
                                videoIndex % 3 === 2
                                  ? styles.noMarginRight
                                  : null,
                              ]}
                              onPress={() =>
                                handleVideoPress(
                                  video,
                                  lessonCategory.category,
                                  lessonCategory.documentId
                                )
                              }>
                              <Image
                                source={{ uri: video.thumbnail }}
                                style={styles.videoThumbnail}
                                resizeMode="cover"
                              />
                              <Text style={styles.videoTitle} numberOfLines={2}>
                                {video.title}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.noLessonsText}>
                    No recommended lessons available.
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: containerPadding,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E6F7FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 2,
    lineHeight: 32,
  },
  lastWatchedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  lastWatchedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F5FAFF',
  },
  lastWatchedVideoBox: {
    width: 120,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E1EEFB',
  },
  lastWatchedThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 10,
  },
  lastWatchedInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  lastWatchedTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#34495E',
  },
  lastWatchedSubtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    marginTop: 4,
  },
  lastWatchedTimestamp: {
    fontSize: 13,
    color: '#95A5A6',
    marginTop: 4,
  },
  noLastWatchedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  noLastWatchedText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  recommendedContainer: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 12,
    paddingLeft: 4,
  },
  videosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  videoBox: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  noMarginRight: {
    marginRight: 0,
  },
  videoThumbnail: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#34495E',
    padding: 8,
    height: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 20,
  },
  noLessonsText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LessonRedirectionStuttering;