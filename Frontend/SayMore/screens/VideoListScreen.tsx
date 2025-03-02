// src/screens/VideoListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image
} from 'react-native';
import { useRoute, useIsFocused, useNavigation } from '@react-navigation/native'; // Import useNavigation
import { Lesson, VideoItem } from '../types/types'; // Import types
import firestore from '@react-native-firebase/firestore';

interface RouteParams {
    lesson: Lesson;
}

const VideoListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>(); // Explicitly use the type
    const isFocused = useIsFocused();
    const { lesson } = route.params as RouteParams; // Type assertion

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

        return () => {
            isSubscribed = false;
            setVideos([]); // Clear videos on unmount
        };
    }, [fetchVideos]);

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
            {item.thumbnail ? (
                <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.thumbnail}
                />
            ) : (
                <View style={styles.noThumbnail}>
                    <Text style={styles.noThumbnailText}>No Thumbnail</Text>
                </View>
            )}
            <Text style={styles.videoTitle}>{item.title}</Text>
        </TouchableOpacity>
    ), [handleVideoPress]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{lesson.title}</Text>
            </View>


            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
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
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    videoItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    videoTitle: {
        fontSize: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        width: 100,
        height: 70,
        marginRight: 10,
    },
    noThumbnail: {
        width: 100,
        height: 70,
        backgroundColor: '#eee',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noThumbnailText: {
        fontSize: 12,
        color: '#666',
    },
});

export default VideoListScreen;