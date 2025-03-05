import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    SafeAreaView
} from 'react-native';
import { useRoute, useIsFocused, useNavigation } from '@react-navigation/native';
import { Lesson, VideoItem } from '../types/types';
import firestore from '@react-native-firebase/firestore';

interface RouteParams {
    lesson: Lesson;
}

const VideoListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
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

        return () => {
            isSubscribed = false;
            setVideos([]);
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{lesson.title}</Text>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButton: {
        marginRight: 10,
        backgroundColor: '#E6F7FF',
        padding: 8,
        borderRadius: 5,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
        flex: 1,
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
    videoTitle: {
        fontSize: 18,
        color: '#003366',
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
    listContentContainer: {
        paddingBottom: 20,
    },
});

export default VideoListScreen;