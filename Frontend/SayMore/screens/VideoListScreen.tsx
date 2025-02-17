import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

interface RouteParams {
  lesson: {
    title: string;
    icon: any;
    documentId: string;
  };
}

interface VideoItem {
  thumbnail: string;
  title: string;
  videoId: string;
  summary?: string;
  summaryImage?: string;
}

const VideoListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { lesson } = route.params as RouteParams;

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.log('Document does not exist');
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [lesson.documentId, isFocused]);

  useEffect(() => {
    let isSubscribed = true;

    const setup = async () => {
      if (isSubscribed) {
        setLoading(true);
        await fetchVideos();
      }
    };

    setup();

    navigation.setOptions({
      title: 'Lessons',
      headerBackTitleVisible: false,
      headerTitleAlign: 'center'
    });

    return () => {
      isSubscribed = false;
      setVideos([]); // Clear videos on unmount
    };
  }, [navigation, fetchVideos]);

  const handleVideoPress = useCallback((video: VideoItem) => {
    if (isFocused) {
      navigation.navigate('VideoPlayer', {
        video,
        lessonTitle: lesson.title
      });
    }
  }, [navigation, lesson.title, isFocused]);

  const renderItem = useCallback(({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleVideoPress(item)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
      />
      <Text style={styles.videoTitle}>{item.title}</Text>
    </TouchableOpacity>
  ), [handleVideoPress]);

  if (!isFocused) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(_, index) => `video-${index}`}
        removeClippedSubviews={false}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 80,
    borderRadius:10,
    marginTop: 4,
  },
  thumbnail: {
    width: 100,
    height: 70,
    marginRight: 10,
    borderRadius: 5,
  },
  videoTitle: {
    fontSize: 15,
    flex: 1,
  },
});

export default VideoListScreen;