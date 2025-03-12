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
    SafeAreaView,
    BackHandler
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useRoute, useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
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
    const isFocused = useIsFocused();
    const { video, lessonTitle } = route.params;
    const { width, height } = Dimensions.get('window');
    const playerHeight = height * 0.3;
    const playerWidth = width;
    const [playing, setPlaying] = useState(false);
    const videoPlayerRef = useRef(null);

    // Refs for tracking state that shouldn't trigger re-renders
    const playStartTimeRef = useRef<number | null>(null);
    const hasPlayedEnoughRef = useRef<boolean>(false);
    const isSavingRef = useRef<boolean>(false);
    const videoSavedRef = useRef<boolean>(false);

    const combinedTitle = `${lessonTitle} - ${video.title}`;

    // Improved save function with better guard clauses and ref-based state tracking
    const saveWatchedVideo = useCallback(async () => {
        // Multiple guard clauses to prevent duplicate saves
        if (videoSavedRef.current || isSavingRef.current || !hasPlayedEnoughRef.current) {
            console.log('Skipping save: already saved, currently saving, or not played enough');
            return;
        }

        const user = auth().currentUser;
        if (!user) {
            console.log('No user is currently signed in. Aborting saveWatchedVideo.');
            return;
        }

        // Set saving flag immediately to prevent concurrent save attempts
        isSavingRef.current = true;
        console.log('Starting to save video to history');

        const now = new Date();
        const timestamp = now.toLocaleString();
        const uniqueId = `${video.videoId}-${Date.now()}`;
        const userId = user.uid;
        console.log('Saving video to history for User ID:', userId);

        const watchedVideoData: WatchedVideo = {
            videoId: video.videoId,
            title: video.title,
            lessonTitle: lessonTitle,
            timestamp: timestamp,
            thumbnail: video.thumbnail || '',
            id: uniqueId,
        };

        try {
            // First check if this video already exists in the user's history
            const userDoc = await firestore()
                .collection('User_Accounts')
                .doc(userId)
                .get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                const existingVideos = userData?.watchedVideos || [];

                // Check if we already have this exact video ID in the history within the last hour
                // This is an extra safeguard against duplicates
                const oneHourAgo = new Date();
                oneHourAgo.setHours(oneHourAgo.getHours() - 1);

                const recentExistingVideo = existingVideos.find((v: WatchedVideo) =>
                    v.videoId === video.videoId &&
                    new Date(v.timestamp) > oneHourAgo
                );

                if (recentExistingVideo) {
                    console.log('Video was already saved recently, skipping duplicate save');
                    videoSavedRef.current = true;
                    isSavingRef.current = false;
                    return;
                }

                // If we get here, it's safe to add to history
                await firestore()
                    .collection('User_Accounts')
                    .doc(userId)
                    .update({
                        watchedVideos: firestore.FieldValue.arrayUnion(watchedVideoData),
                    });
                console.log('Video successfully saved to history:', uniqueId);
            }

            // Mark video as saved to prevent duplicate saves
            videoSavedRef.current = true;
        } catch (error) {
            console.error('Error saving watched video to User_Accounts:', error);
        } finally {
            // Even if there's an error, mark saving as done to prevent infinite retry loops
            isSavingRef.current = false;
        }
    }, [video, lessonTitle]);

    // Check if video has played enough to be considered "watched"
    const checkPlayDuration = useCallback(() => {
        if (playStartTimeRef.current !== null && !hasPlayedEnoughRef.current) {
            const playDuration = Date.now() - playStartTimeRef.current;
            if (playDuration >= 1000) { // 1 second threshold
                console.log(`Video played for ${playDuration}ms - marking as watched`);
                hasPlayedEnoughRef.current = true;
            }
        }
    }, []);

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

            // Check if we've played enough to mark as watched
            checkPlayDuration();

            // If we've played enough and we're pausing/ending, try to save
            if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                saveWatchedVideo();
            }
        }
    }, [checkPlayDuration, saveWatchedVideo]);

    // Handle back button press
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isFocused) {
                // Final check before navigating away
                checkPlayDuration();
                if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                    saveWatchedVideo();
                }
                navigation.goBack();
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [isFocused, navigation, checkPlayDuration, saveWatchedVideo]);

    // Save video when navigating away if it has been played enough
    useFocusEffect(
        useCallback(() => {
            return () => {
                console.log('VideoPlayer screen is losing focus');
                checkPlayDuration();

                // If we've played enough but haven't saved yet, save now
                if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                    console.log('Saving video on navigation away');
                    saveWatchedVideo();
                }
            };
        }, [checkPlayDuration, saveWatchedVideo])
    );

    // Set up a timer to periodically check if we should mark the video as watched
    useEffect(() => {
        const watchTimer = setInterval(() => {
            if (playing && playStartTimeRef.current !== null) {
                checkPlayDuration();
            }
        }, 1000);

        return () => clearInterval(watchTimer);
    }, [playing, checkPlayDuration]);

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            console.log('Component unmounting, final save check');

            // One final check to save the video if needed
            if (hasPlayedEnoughRef.current && !videoSavedRef.current && !isSavingRef.current) {
                saveWatchedVideo();
            }
        };
    }, [saveWatchedVideo]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            // Check if we've played enough and save if needed before going back
                            checkPlayDuration();
                            if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                                saveWatchedVideo();
                            }
                            navigation.goBack();
                        }}
                    >
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