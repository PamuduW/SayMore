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
import firestore from '@react-native-firebase/firestore';
import { VideoItem } from '../types/types';

interface UnderstandingAndOvercomingStutteringScreenProps {}

// Get the width of the device's window
const { width } = Dimensions.get('window');
// Calculate the width of each video box
const videoBoxWidth = (width - 75) / 3;
// Set the margin for each video box
const videoBoxMargin = 15;

/**
 * UnderstandingAndOvercomingStutteringScreen component that displays videos
 * related to understanding and overcoming stuttering.
 * @returns {JSX.Element} The rendered component.
 */
const UnderstandingAndOvercomingStutteringScreen: React.FC<
  UnderstandingAndOvercomingStutteringScreenProps
> = () => {
  const navigation = useNavigation();
  const [understandingVideos, setUnderstandingVideos] = useState<VideoItem[]>(
    []
  );
  const [overcomingVideos, setOvercomingVideos] = useState<VideoItem[]>([]);
  const [recommendedLessons, setRecommendedLessons] = useState<
    {
      category: string;
      documentId: string;
      videos: VideoItem[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches videos related to understanding and overcoming stuttering from Firestore.
   */
  const fetchImprovementVideos = useCallback(async () => {
    try {
      const understandingSnapshot = await firestore()
        .collection('lesson_videos')
        .doc('understanding_stuttering')
        .get();

      const overcomingSnapshot = await firestore()
        .collection('lesson_videos')
        .doc('overcoming_stuttering')
        .get();

      if (understandingSnapshot.exists) {
        const data = understandingSnapshot.data();
        setUnderstandingVideos((data?.videos as VideoItem[]) || []);
      } else {
        setUnderstandingVideos([]);
      }

      if (overcomingSnapshot.exists) {
        const data = overcomingSnapshot.data();
        setOvercomingVideos((data?.videos as VideoItem[]) || []);
      } else {
        setOvercomingVideos([]);
      }
    } catch (error) {
      setUnderstandingVideos([]);
      setOvercomingVideos([]);
    }
  }, []);

  useEffect(() => {
    /**
     * Fetches recommended lessons from Firestore.
     */
    const fetchRecommendedLessons = async () => {
      try {
        const stutteringLessons = [
          { title: 'Speech Exercises', documentId: 'speech_exercises' },
          { title: 'Building Confidence', documentId: 'building_confidence' },
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
    const loadData = async () => {
      setLoading(true);
      await fetchImprovementVideos();
      await fetchRecommendedLessons();
      setLoading(false);
    };

    loadData();
  }, [fetchImprovementVideos]);

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  /**
   * Handles the video press to navigate to the VideoPlayer screen.
   * @param {VideoItem} video - The video item to play.
   * @param {string} lessonTitle - The title of the lesson.
   * @param {string} _documentId - The document ID of the lesson.
   */
  const handleVideoPress = (
    video: VideoItem,
    lessonTitle: string,
    _documentId: string
  ) => {
    navigation.navigate('VideoPlayer', {
      video,
      lessonTitle: lessonTitle,
    });
  };

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
              <Text style={styles.headerText}>
                Understanding & Overcoming Stuttering
              </Text>
            </View>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading content...</Text>
          ) : (
            <>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>You Should Improve In:</Text>

                {understandingVideos.length > 0 ||
                overcomingVideos.length > 0 ? (
                  <>
                    {understandingVideos.length > 0 && (
                      <View style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>
                          Understanding Stuttering
                        </Text>
                        <View style={styles.videosGrid}>
                          {understandingVideos.map((video, videoIndex) => (
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
                                  'Understanding Stuttering',
                                  'understanding_stuttering'
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
                    )}
                    {overcomingVideos.length > 0 && (
                      <View style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>
                          Overcoming Stuttering
                        </Text>
                        <View style={styles.videosGrid}>
                          {overcomingVideos.map((video, videoIndex) => (
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
                                  'Overcoming Stuttering',
                                  'overcoming_stuttering'
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
                    )}
                  </>
                ) : (
                  <Text style={styles.noLessonsText}>
                    No improvement videos available.
                  </Text>
                )}
              </View>

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
    padding: 20,
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
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
    shadowRadius: 4,
    elevation: 3,
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

export default UnderstandingAndOvercomingStutteringScreen;