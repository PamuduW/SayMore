import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView
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

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { video, lessonTitle } = route.params;
    const { width, height } = Dimensions.get('window');
    const playerHeight = height * 0.3;
    const playerWidth = width;
    const [playing, setPlaying] = useState(false);
    const [videoSaved, setVideoSaved] = useState(false);
    const playStartTimeRef = useRef<number | null>(null);
    const videoPlayerRef = useRef(null);

    const combinedTitle = `${lessonTitle} - ${video.title}`;

    const saveWatchedVideo = async () => {
        // If we've already saved this video view, don't save it again
        if (videoSaved) return;

        const now = new Date();
        const timestamp = now.toLocaleString();
        const uniqueId = `${video.videoId}-${Date.now()}`; // Create a unique ID using current timestamp
        const user = auth().currentUser;

        if (!user) {
            console.log('No user is currently signed in. Aborting saveWatchedVideo.');
            return;
        }

        const userId = user.uid;
        console.log('Saving video to history for User ID:', userId);

        const watchedVideoData: WatchedVideo = {
            videoId: video.videoId,
            title: video.title,
            lessonTitle: lessonTitle,
            timestamp: timestamp,
            thumbnail: video.thumbnail || '',
            id: uniqueId, // Use the unique ID
        };

        try {
            // Add the new watch entry to Firebase
            await firestore()
                .collection('User_Accounts')
                .doc(userId)
                .update({
                    watchedVideos: firestore.FieldValue.arrayUnion(watchedVideoData),
                });
            console.log('Video successfully saved to history:', watchedVideoData);

            // Mark video as saved to prevent duplicate saves
            setVideoSaved(true);
        } catch (error) {
            console.error('Error saving watched video to User_Accounts:', error);
        }
    };

    // This function will be called when the play state of the video changes
    const onStateChange = useCallback((state: string) => {
        console.log('YouTube player state changed:', state);

        if (state === 'playing') {
            setPlaying(true);

            // Record the time when playback starts if not already set
            if (playStartTimeRef.current === null) {
                playStartTimeRef.current = Date.now();
                console.log('Video playback started, starting timer');
            }
        } else if (state === 'paused' || state === 'ended' || state === 'stopped') {
            setPlaying(false);

            // If playback has started previously and we have a start time
            if (playStartTimeRef.current !== null) {
                // Calculate how long the video has played
                const playDuration = Date.now() - playStartTimeRef.current;
                console.log(`Video played for ${playDuration}ms before pausing/ending`);

                // If the video played for at least 1000ms (1 second) and hasn't been saved yet
                if (playDuration >= 1000 && !videoSaved) {
                    console.log('Saving video to history after 1+ second of playback');
                    saveWatchedVideo();
                }
            }
        }
    }, [videoSaved]);

    // Alternative method to track video playback using a timer
    useEffect(() => {
        let playbackTimer: NodeJS.Timeout | null = null;

        if (playing && !videoSaved && playStartTimeRef.current === null) {
            // If the onStateChange doesn't correctly capture the playing state
            // use this as a fallback method
            console.log('Fallback: Video appears to be playing, starting timer');
            playStartTimeRef.current = Date.now();

            playbackTimer = setTimeout(() => {
                if (playing && !videoSaved) {
                    console.log('Fallback: Saving video after 1 second of detected playback');
                    saveWatchedVideo();
                }
            }, 1000);
        }

        return () => {
            if (playbackTimer) {
                clearTimeout(playbackTimer);
            }
        };
    }, [playing, videoSaved]);

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            // Reset refs and state
            playStartTimeRef.current = null;
        };
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
                            {combinedTitle}
                        </Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.videoContainer}>
                        <YoutubeIframe
                            height={playerHeight}
                            width={playerWidth}
                            videoId={video.videoId}
                            play={playing}
                            onChangeState={onStateChange}
                            ref={videoPlayerRef}
                            forceAndroidAutoplay={true}
                        />
                    </View>

                    <View style={styles.videoInfoContainer}>
                        <Text style={styles.videoTitle}>{video.title}</Text>
                        <Text style={styles.lessonSubtitle}>{lessonTitle}</Text>
                    </View>

                    {video.summary && (
                        <View style={styles.summaryOuterContainer}>
                            <View style={styles.summaryHeaderContainer}>
                                <Text style={styles.summaryHeaderText}>Summary</Text>
                            </View>
                            <View style={styles.summaryCardContainer}>
                                {video.summaryImage && (
                                    <Image source={{ uri: video.summaryImage }} style={styles.summaryImage} />
                                )}
                                <Text style={styles.summaryText}>{video.summary}</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>
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
        backgroundColor: '#F0F8FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F0F8FF',
        borderBottomWidth: 1,
        borderBottomColor: '#E1EEFB',
    },
    backButton: {
        padding: 4,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0066CC',
    },
    headerTextContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#003366',
    },
    scrollContent: {
        flex: 1,
    },
    videoContainer: {
        alignItems: 'center',
        backgroundColor: '#003366',
        marginBottom: -45,
    },
    videoInfoContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E1EEFB',
        marginBottom: 16,
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#003366',
        marginBottom: 4,
    },
    lessonSubtitle: {
        fontSize: 14,
        color: '#4A6D8C',
    },
    summaryOuterContainer: {
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    summaryHeaderContainer: {
        backgroundColor: '#E1EEFB',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    summaryHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#003366',
        textAlign: 'center',
    },
    summaryCardContainer: {
        padding: 16,
    },
    summaryImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginBottom: 16,
    },
    summaryText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#003366',
    },
});

export default VideoPlayerScreen;