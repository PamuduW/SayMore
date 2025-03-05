import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WatchedVideo } from '../types/types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type RootStackParamList = {
    VideoPlayer: {
        video: {
            videoId: string;
            title: string;
            summary?: string;
            thumbnail: string;
            summaryImage?: string;
        };
        lessonTitle: string;
    };
};

type VideoPlayerRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;
type VideoPlayerNavigationProp = StackNavigationProp<RootStackParamList, 'VideoPlayer'>;

interface VideoPlayerScreenProps {
    route: VideoPlayerRouteProp;
    navigation: VideoPlayerNavigationProp;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ route, navigation }) => {
    const { video, lessonTitle } = route.params;
    const { width, height } = Dimensions.get('window');
    const playerHeight = height / 2;
    const playerWidth = width * 0.95;
    const playerMarginHorizontal = width * 0.05;

    const combinedTitle = `${lessonTitle} - ${video.title}`;

    useEffect(() => {
        const saveWatchedVideo = async () => {
            const now = new Date();
            const timestamp = now.toLocaleString();
            const user = auth().currentUser;

            if (!user) {
                console.log('No user is currently signed in. Aborting saveWatchedVideo.');
                return;
            }

            const userId = user.uid;
            console.log('Signed in User ID:', userId);

            const watchedVideoData: WatchedVideo = {
                videoId: video.videoId,
                title: video.title,
                lessonTitle: lessonTitle,
                timestamp: timestamp,
                thumbnail: video.thumbnail || '',
                id: `${video.videoId}-${timestamp}`,
            };

            try {
                // Fetch existing watchedVideos data
                const userDoc = await firestore()
                    .collection('User_Accounts')
                    .doc(userId)
                    .get();

                let watchedVideos = userDoc.data()?.watchedVideos || [];

                // Check if the video already exists in the array
                const videoAlreadyWatched = watchedVideos.some(
                    (watchedVideo) => watchedVideo.videoId === video.videoId
                );

                if (!videoAlreadyWatched) {
                    // Add the video to the array only if it doesn't exist
                    await firestore()
                        .collection('User_Accounts')
                        .doc(userId)
                        .update({
                            watchedVideos: firestore.FieldValue.arrayUnion(watchedVideoData),
                        });
                    console.log('Watched video saved to User_Accounts:', watchedVideoData);
                } else {
                    console.log('Video already watched. Not adding to history.');
                }
            } catch (error) {
                console.error('Error saving watched video to User_Accounts:', error);
            }
        };
        saveWatchedVideo();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.lessonHeader}>{combinedTitle}</Text>
            </View>

            <View style={{ ...styles.videoContainer, width: playerWidth, marginHorizontal: playerMarginHorizontal }}>
                <YoutubeIframe
                    height={playerHeight}
                    width={playerWidth}
                    videoId={video.videoId}
                />
            </View>

            {video.summary && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Summary</Text>
                    {video.summaryImage && (
                        <Image source={{ uri: video.summaryImage }} style={styles.summaryImage} />
                    )}
                    <Text style={styles.summaryText}>{video.summary}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 20 },
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        //padding: 20,
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
    lessonHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
        textAlign: 'center',
    },
    videoContainer: {
        alignSelf: 'center',
    },
    summaryContainer: {
        padding: 10,
        marginTop: -215,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 20,
        textAlign: 'center'
    },
    summaryText: {
        fontSize: 18,
        color: '#003366',
    },
    summaryImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 20,
    }
});

export default VideoPlayerScreen;