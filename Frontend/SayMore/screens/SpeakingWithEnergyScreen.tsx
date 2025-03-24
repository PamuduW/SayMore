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

interface SpeakingWithEnergyScreenProps {}

/**
 * SpeakingWithEnergyScreen component that displays videos and recommended lessons
 * related to speaking with energy.
 * @returns {JSX.Element} The rendered component.
 */
const SpeakingWithEnergyScreen: React.FC<SpeakingWithEnergyScreenProps> = () => {
  const navigation = useNavigation();
  const [energyVideos, setEnergyVideos] = useState<VideoItem[]>([]);
  const [recommendedLessons, setRecommendedLessons] = useState<
    {
      category: string;
      documentId: string;
      videos: VideoItem[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches videos related to speaking with energy from Firestore.
   */
  const fetchEnergyVideos = useCallback(async () => {
    try {
      const energySnapshot = await firestore()
        .collection('lesson_videos')
        .doc('energy')
        .get();

      if (energySnapshot.exists) {
        const data = energySnapshot.data();
        setEnergyVideos((data?.videos as VideoItem[]) || []);
      } else {
        setEnergyVideos([]);
      }
    } catch (error) {
      setEnergyVideos([]);
    }
  }, []);

  useEffect(() => {
    /**
     * Fetches recommended lessons from Firestore.
     */
    const fetchRecommendedLessons = async () => {
      try {
        const publicSpeakingLessons = [
          { title: 'Communication Tips', documentId: 'communication_tips' },
          { title: 'Managing Stage Fright', documentId: 'stage_fright' },
          { title: 'Clarity in Speech', documentId: 'clarity' },
          { title: 'Perfecting Your Pitch', documentId: 'pitch' },
          { title: 'Speaking with Energy', documentId: 'energy' },
        ];

        const lessonsWithVideos = [];

        for (const lesson of publicSpeakingLessons) {
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

        const filteredLessons = lessonsWithVideos.filter(
          lesson => lesson.category !== 'Speaking with Energy'
        );

        setRecommendedLessons(filteredLessons);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    /**
     * Loads data by fetching energy videos and recommended lessons.
     */
    const loadData = async () => {
      setLoading(true);
      await fetchEnergyVideos();
      await fetchRecommendedLessons();
      setLoading(false);
    };

    loadData();
  }, [fetchEnergyVideos]);

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
              <Image
                source={require('../assets/back.png')} // Update this path to your back.png location
                style={styles.backButtonImage}
              />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Speaking with Energy</Text>
            </View>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading content...</Text>
          ) : (
            <>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>You Should Improve In :</Text>

                {energyVideos.length > 0 ? (
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>
                      Speaking with Energy
                    </Text>
                    <View style={styles.videosGrid}>
                      {energyVideos.map((video, videoIndex) => (
                        <TouchableOpacity
                          key={videoIndex}
                          style={[
                            styles.videoBox,
                            {
                              width: videoBoxWidth,
                              marginRight: videoBoxMargin,
                            },
                            videoIndex % 3 === 2 ? styles.noMarginRight : null,
                          ]}
                          onPress={() =>
                            handleVideoPress(
                              video,
                              'Speaking with Energy',
                              'energy'
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
    backgroundColor: '#B9D9EB',
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
  backButtonImage: {
    width: 24,
    height: 24,
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
  noMarginRight: {
    marginRight: 0,
  },
});

export default SpeakingWithEnergyScreen;