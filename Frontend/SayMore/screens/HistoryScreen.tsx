import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { WatchedVideo } from '../types/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';

interface HistoryScreenProps {}

/**
 * HistoryScreen component that displays a list of watched videos.
 * @returns {JSX.Element} The rendered component.
 */
const HistoryScreen: React.FC<HistoryScreenProps> = () => {
  const [watchedVideos, setWatchedVideos] = useState<WatchedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    /**
     * Fetches the list of watched videos from Firestore.
     */
    const fetchWatchedVideos = async () => {
      try {
        setLoading(true);
        const user = auth().currentUser;

        if (!user) {
          setWatchedVideos([]);
          setLoading(false);
          return;
        }

        const userId = user.uid;

        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(userId)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();
          if (data && data.watchedVideos) {
            const videos = data.watchedVideos.slice().reverse();
            setWatchedVideos(videos);
          } else {
            setWatchedVideos([]);
          }
        } else {
          setWatchedVideos([]);
        }
      } catch (error) {
        setWatchedVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedVideos();
  }, []);

  /**
   * Fetches the details of a specific video from Firestore.
   * @param {string} videoId - The ID of the video to fetch details for.
   * @returns {Promise<any>} The video details.
   */
  const fetchVideoDetails = useCallback(
    async (videoId: string): Promise<any> => {
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
              return {
                videoId: video.videoId,
                title: video.title,
                thumbnail: video.thumbnail || undefined,
                summary: video.summary || undefined,
                summaryImage: video.summaryImage || undefined,
              };
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

  /**
   * Handles the press event on a video item to navigate to the VideoPlayer screen.
   * @param {WatchedVideo} video - The video item that was pressed.
   */
  const handleVideoPress = useCallback(
    async (video: WatchedVideo) => {
      setLoading(true);

      try {
        const videoDetails = await fetchVideoDetails(
          video.videoId,
          video.lessonTitle
        );

        const fullVideoData = videoDetails || {
          videoId: video.videoId,
          title: video.title,
          thumbnail: video.thumbnail || undefined,
        };

        navigation.navigate('VideoPlayer', {
          video: fullVideoData,
          lessonTitle: video.lessonTitle,
        });
      } catch (error) {
        navigation.navigate('VideoPlayer', {
          video: {
            videoId: video.videoId,
            title: video.title,
            thumbnail: video.thumbnail || undefined,
          },
          lessonTitle: video.lessonTitle,
        });
      } finally {
        setLoading(false);
      }
    },
    [navigation, fetchVideoDetails]
  );

  /**
   * Renders a single video item in the list.
   * @param {Object} item - The video item to render.
   * @returns {JSX.Element} The rendered video item.
   */
  const renderItem = useCallback(
    ({ item }: { item: WatchedVideo }) => (
      <TouchableOpacity
        style={theme === 'dark' ? styles.darkHistoryItem : styles.historyItem}
        onPress={() => handleVideoPress(item)}>
        <Image
          source={{
            uri: item.thumbnail || 'https://via.placeholder.com/80x60',
          }}
          style={styles.thumbnail}
        />
        <View style={styles.videoDetails}>
          <Text
            style={
              theme === 'dark' ? styles.darkHistoryTitle : styles.historyTitle
            }>
            {item.title}
          </Text>
          <Text
            style={
              theme === 'dark'
                ? styles.darkHistoryTimeStamp
                : styles.historyTimestamp
            }>
            Watched on: {item.timestamp}
          </Text>
          <Text
            style={
              theme === 'dark' ? styles.darkHistoryLesson : styles.historyLesson
            }>
            Lesson: {item.lessonTitle}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handleVideoPress, theme]
  );

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={theme === 'dark' ? styles.darkContainer : styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={
            theme === 'dark' ? styles.darkBackButton : styles.lightBackButton
          }
          onPress={handleBackPress}>
          <Text
            style={
              theme === 'dark'
                ? styles.darkBackButtonText
                : styles.lightBackButtonText
            }>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={theme === 'dark' ? styles.darkHeader : styles.header}>
          Watched Video History
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme === 'dark' ? '#FFFFFF' : '#003366'}
          />
          <Text
            style={
              theme === 'dark' ? styles.darkLoadingText : styles.loadingText
            }>
            Loading history...
          </Text>
        </View>
      ) : watchedVideos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={theme === 'dark' ? styles.darkEmptyText : styles.emptyText}>
            No watched videos yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={watchedVideos}
          keyExtractor={(item, index) => {
            return item.id
              ? `${item.id}-${index}`
              : `${item.videoId}-${item.timestamp}-${index}`;
          }}
          renderItem={renderItem}
          removeClippedSubviews={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#577BC1',
  },
  darkContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3A3A3A',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#003366',
  },
  darkHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFFFFF',
  },
  historyItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ADD8E6',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  darkHistoryItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#e1e1e1',
  },
  videoDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  darkHistoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#778899',
  },
  darkHistoryTimeStamp: {
    fontSize: 12,
    color: '#999999',
  },
  historyLesson: {
    fontSize: 14,
    color: '#333',
  },
  darkHistoryLesson: {
    fontSize: 14,
    color: '#FFFFFF',
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
    backgroundColor: '#222222',
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
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 2,
    lineHeight: 32,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#003366',
    marginTop: 10,
  },
  darkLoadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#003366',
  },
  darkEmptyText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default HistoryScreen;
