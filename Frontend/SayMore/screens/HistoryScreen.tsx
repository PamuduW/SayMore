import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { WatchedVideo } from '../types/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

interface HistoryScreenProps {}

const HistoryScreen: React.FC<HistoryScreenProps> = () => {
    const [watchedVideos, setWatchedVideos] = useState<WatchedVideo[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchWatchedVideos = async () => {
            try {
                const user = auth().currentUser;

                if (!user) {
                    console.log('No user signed in. Cannot fetch history.');
                    return;
                }

                const userId = user.uid;
                console.log(`Fetching history for User ID: ${userId}`);

                const userDoc = await firestore()
                    .collection('User_Accounts')
                    .doc(userId)
                    .get();

                if (userDoc.exists) {
                    const data = userDoc.data();
                    if (data && data.watchedVideos) {
                        setWatchedVideos(data.watchedVideos as WatchedVideo[]);
                    } else {
                        setWatchedVideos([]);
                    }
                } else {
                    console.log('User document does not exist.');
                    setWatchedVideos([]);
                }


            } catch (error) {
                console.error('Error fetching watched videos:', error);
                setWatchedVideos([]);
            }
        };

        fetchWatchedVideos();
    }, []);

    const handleVideoPress = useCallback((video: WatchedVideo) => {
        navigation.navigate('VideoPlayer', {
            video: {
                videoId: video.videoId,
                title: video.title,
            },
            lessonTitle: video.lessonTitle
        });
    }, [navigation]);

    const renderItem = useCallback(({ item }: { item: WatchedVideo }) => (
        <TouchableOpacity style={styles.historyItem} onPress={() => handleVideoPress(item)}>
            <Image source={{ uri: item.thumbnail || 'placeholder_image_url' }} style={styles.thumbnail} />
            <View style={styles.videoDetails}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyTimestamp}>Watched on: {item.timestamp}</Text>
                <Text style={styles.historyLesson}>Lesson: {item.lessonTitle}</Text>
            </View>
        </TouchableOpacity>
    ), [handleVideoPress]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.header}>Watched Video History</Text>
            </View>
            <FlatList
                data={watchedVideos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                removeClippedSubviews={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F0F8FF',
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
    thumbnail: {
        width: 80,
        height: 60,
        marginRight: 10,
        borderRadius: 5,
    },
    videoDetails: {
        flex: 1,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#003366',
    },
    historyTimestamp: {
        fontSize: 12,
        color: '#778899',
    },
    historyLesson: {
        fontSize: 14,
        color: '#333',
    },
    backButton: {
        padding: 5,
        borderRadius: 5,
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
    },
});

export default HistoryScreen;