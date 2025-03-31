import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  useRoute,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { Lesson, VideoItem } from '../types/types';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../components/ThemeContext';

interface RouteParams {
  lesson: Lesson;
}

/**
 * VideoListScreen component that displays a list of videos for a specific lesson.
 * @returns {JSX.Element} The rendered component.
 */
const VideoListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const { lesson } = route.params as RouteParams;
  const theme = useTheme();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the videos for the given lesson from Firestore.
   */
  const fetchVideos = useCallback(async () => {
    if (!isFocused) return;

    try {
      const documentSnapshot = await firestore()
        .collection('lesson_videos')
        .doc(lesson.documentId)
        .get();

      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        if (data?.videos) {
          setVideos(data.videos as VideoItem[]);
        } else {
          setVideos([]);
        }
      } else {
        setVideos([]);
      }
    } catch (error) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [lesson.documentId, isFocused]);

  useEffect(() => {
    let isSubscribed = true;

    /**
     * Sets up the component by fetching the videos.
     */
    const setup = async () => {
      if (isSubscribed) {
        setLoading(true);
        await fetchVideos();
      }
    };

    setup();

    return () => {
      isSubscribed = false;
      setVideos([]);
    };
  }, [fetchVideos]);

  /**
   * Handles the video press to navigate to the VideoPlayer screen.
   * @param {VideoItem} video - The video item to play.
   */
  const handleVideoPress = useCallback(
    (video: VideoItem) => {
      if (isFocused) {
        navigation.navigate('VideoPlayer', {
          video,
          lessonTitle: lesson.title,
        });
      }
    },
    [navigation, lesson.title, isFocused]
  );

  /**
   * Renders a single video item in the list.
   * @param {Object} item - The video item to render.
   * @returns {JSX.Element} The rendered video item.
   */
  const renderItem = useCallback(
    ({ item }: { item: VideoItem }) => (
      <TouchableOpacity
        style={theme === 'dark' ? styles.darkVideoItem : styles.videoItem}
        onPress={() => handleVideoPress(item)}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={styles.noThumbnail}>
            <Text
              style={
                theme === 'dark'
                  ? styles.noThumbnailText
                  : styles.darkNoThumbnailText
              }>
              No Thumbnail
            </Text>
          </View>
        )}
        <Text
          style={theme === 'dark' ? styles.darkVideoTitle : styles.videoTitle}>
          {item.title}
        </Text>
      </TouchableOpacity>
    ),
    [handleVideoPress, theme]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={theme === 'dark' ? styles.darkContainer : styles.container}>
        <View style={theme === 'dark' ? styles.header : styles.header}>
          <TouchableOpacity
            style={
              theme === 'dark' ? styles.darkBackButton : styles.lightBackButton
            }
            onPress={() => navigation.goBack()}>
            <Text
              style={
                theme === 'dark'
                  ? styles.darkBackButtonText
                  : styles.lightBackButtonText
              }>
              ←
            </Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={theme === 'dark' ? styles.darkTitle : styles.title}>
              {lesson.title}
            </Text>
          </View>
        </View>

        {loading ? (
          <View
            style={
              theme === 'dark'
                ? styles.darkLoadingContainer
                : styles.loadingContainer
            }>
            <ActivityIndicator size="large" color="#003366" />
          </View>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item, index) => String(index)}
            renderItem={renderItem}
            removeClippedSubviews={false}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  darkContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2B2B2B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  lightBackButton: {
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
  darkBackButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  lightBackButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 2,
    lineHeight: 32,
  },
  darkBackButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 2,
    lineHeight: 32,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
  darkTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  videoItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#E6F7FF',
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  darkVideoItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  videoTitle: {
    fontSize: 18,
    color: '#003366',
    flex: 1,
  },
  darkVideoTitle: {
    fontSize: 18,
    color: '#000',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 70,
    marginRight: 15,
    borderRadius: 10,
  },
  noThumbnail: {
    width: 100,
    height: 70,
    backgroundColor: '#ADD8E6',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  noThumbnailText: {
    fontSize: 12,
    color: '#003366',
  },
  darkNoThumbnailText: {
    fontSize: 12,
    color: '#000',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});

export default VideoListScreen;
