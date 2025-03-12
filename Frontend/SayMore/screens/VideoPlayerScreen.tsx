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
    BackHandler,
    ToastAndroid,
    Platform,
    Alert
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
    PointsScreen: {
        points: number;
        totalPoints: number;
        videoTitle: string;
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
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { video, lessonTitle } = route.params;
    const { width, height } = Dimensions.get('window');
    const playerHeight = height * 0.3;
    const playerWidth = width;
    const [playing, setPlaying] = useState(false);
    const videoPlayerRef = useRef<any>(null);

    // Video watching tracking
    const playStartTimeRef = useRef<number | null>(null);
    const hasPlayedEnoughRef = useRef<boolean>(false);
    const isSavingRef = useRef<boolean>(false);
    const videoSavedRef = useRef<boolean>(false);

    // Points system variables
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [currentPercentage, setCurrentPercentage] = useState<number>(0);
    const lastWatchTimeRef = useRef<number>(0);
    const watchedDurationRef = useRef<number>(0);
    const pointsAwardedRef = useRef<boolean>(false);
    const checkPointsIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastPointsPercentageRef = useRef<number>(0);
    const totalPointsEarnedRef = useRef<number>(0);

    // For video position polling
    const positionPollingRef = useRef<NodeJS.Timeout | null>(null);

    const combinedTitle = `${lessonTitle} - ${video.title}`;

    // Show notification to user
    const showNotification = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('', message);
        }
    };

    // Calculate points based on percentage watched
    const calculatePoints = (percentageWatched: number, durationInSeconds: number): number => {
        // Base points - 1 point per 10% watched (rounded down)
        const basePoints = Math.floor(percentageWatched / 10);

        // Length multiplier
        let lengthMultiplier = 1;
        if (durationInSeconds > 3600) { // > 60 minutes
            lengthMultiplier = 2;
        } else if (durationInSeconds > 1800) { // > 30 minutes
            lengthMultiplier = 1.5;
        } else if (durationInSeconds > 600) { // > 10 minutes
            lengthMultiplier = 1.2;
        }

        return Math.round(basePoints * lengthMultiplier);
    };

    // Award points to user
    const awardPoints = useCallback(async (points: number) => {
        try {
            const user = auth().currentUser;
            if (!user) {
                console.log('No user logged in, cannot award points');
                return;
            }

            const userId = user.uid;
            totalPointsEarnedRef.current += points;

            // Update user's points in Firestore
            await firestore()
                .collection('User_Accounts')
                .doc(userId)
                .update({
                    points: firestore.FieldValue.increment(points),
                    // Also keep a record of points history
                    pointsHistory: firestore.FieldValue.arrayUnion({
                        videoId: video.videoId,
                        videoTitle: video.title,
                        lessonTitle: lessonTitle,
                        pointsEarned: points,
                        timestamp: new Date().toISOString()
                    })
                });

            showNotification(`You earned ${points} points!`);
            console.log(`User ${userId} awarded ${points} points for watching ${video.title}`);

        } catch (error) {
            console.error('Error awarding points:', error);
        }
    }, [video, lessonTitle]);

    // Check watching progress and award points
    const checkWatchingProgress = useCallback(async () => {
        if (!videoPlayerRef.current || pointsAwardedRef.current || videoDuration === 0) {
            return;
        }

        try {
            // Get current time using the player reference
            const currentTime = await videoPlayerRef.current.getCurrentTime();

            // Update watched duration
            if (playing && lastWatchTimeRef.current > 0) {
                // Only count time if actually playing
                const timeIncrement = currentTime - lastWatchTimeRef.current;
                if (timeIncrement > 0 && timeIncrement < 10) { // Sanity check to avoid jumps
                    watchedDurationRef.current += timeIncrement;
                }
            }
            lastWatchTimeRef.current = currentTime;

            // Calculate percentage watched
            const percentageWatched = Math.min(100, Math.round((watchedDurationRef.current / videoDuration) * 100));
            setCurrentPercentage(percentageWatched);

            // Determine points based on percentage thresholds (10%, 25%, 50%, 75%, 100%)
            const thresholds = [10, 25, 50, 75, 100];

            // Find the highest threshold reached that we haven't awarded points for yet
            let highestThresholdReached = 0;
            for (const threshold of thresholds) {
                if (percentageWatched >= threshold && lastPointsPercentageRef.current < threshold) {
                    highestThresholdReached = threshold;
                }
            }

            // Award points if we've reached a new threshold
            if (highestThresholdReached > 0) {
                const pointsEarned = calculatePoints(highestThresholdReached, videoDuration);
                lastPointsPercentageRef.current = highestThresholdReached;

                // If we've reached 100%, mark as fully awarded to prevent further checks
                if (highestThresholdReached === 100) {
                    pointsAwardedRef.current = true;
                }

                await awardPoints(pointsEarned);
                console.log(`Awarded points for reaching ${highestThresholdReached}% of the video`);

                // Special completion message at 100%
                if (highestThresholdReached === 100) {
                    showNotification(`Congratulations! You've completed this video.`);

                    // Navigate to PointsScreen after a short delay
                    const maxPossiblePoints = calculatePoints(100, videoDuration);
                    setTimeout(() => {
                        navigation.navigate('PointsScreen', {
                            points: totalPointsEarnedRef.current,
                            totalPoints: maxPossiblePoints,
                            videoTitle: video.title
                        });
                    }, 1000);
                }
            }

        } catch (error) {
            console.error('Error checking watching progress:', error);
        }
    }, [playing, videoDuration, awardPoints, navigation, video.title]);

    // Poll video position regularly to update progress
    const startPositionPolling = useCallback(() => {
        if (positionPollingRef.current) {
            clearInterval(positionPollingRef.current);
        }

        positionPollingRef.current = setInterval(async () => {
            if (videoPlayerRef.current && playing) {
                try {
                    const currentTime = await videoPlayerRef.current.getCurrentTime();
                    const percentageWatched = Math.min(100, Math.round((currentTime / videoDuration) * 100));
                    setCurrentPercentage(percentageWatched);

                    // Update watched duration directly based on current position
                    if (currentTime > watchedDurationRef.current) {
                        watchedDurationRef.current = currentTime;
                    }
                } catch (error) {
                    console.error('Error polling video position:', error);
                }
            }
        }, 1000); // Poll every second for smoother updates

        return () => {
            if (positionPollingRef.current) {
                clearInterval(positionPollingRef.current);
                positionPollingRef.current = null;
            }
        };
    }, [playing, videoDuration]);

    // Initialize video duration when player is ready
    const onPlayerReady = useCallback(async () => {
        try {
            if (videoPlayerRef.current) {
                const duration = await videoPlayerRef.current.getDuration();
                console.log('Video duration:', duration, 'seconds');
                setVideoDuration(duration);

                // Start position polling once we have duration
                startPositionPolling();
            }
        } catch (error) {
            console.error('Error getting video duration:', error);
        }
    }, [startPositionPolling]);

    const saveWatchedVideo = useCallback(async () => {
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

        // Track percentage watched in the history
        const percentageWatched = videoDuration > 0
            ? Math.min(100, Math.round((watchedDurationRef.current / videoDuration) * 100))
            : 0;

        const watchedVideoData: WatchedVideo = {
            videoId: video.videoId,
            title: video.title,
            lessonTitle: lessonTitle,
            timestamp: timestamp,
            thumbnail: video.thumbnail || '',
            id: uniqueId,
            percentageWatched: percentageWatched, // Add percentage watched to history
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

                const oneHourAgo = new Date();
                oneHourAgo.setHours(oneHourAgo.getHours() - 1);

                const recentExistingVideo = existingVideos.find((v: WatchedVideo) =>
                    v.videoId === video.videoId &&
                    new Date(v.timestamp) > oneHourAgo
                );

                if (recentExistingVideo) {
                    // Update the existing record if new percentage is higher
                    const existingPercentage = recentExistingVideo.percentageWatched || 0;
                    if (percentageWatched > existingPercentage) {
                        // Remove old record
                        await firestore()
                            .collection('User_Accounts')
                            .doc(userId)
                            .update({
                                watchedVideos: firestore.FieldValue.arrayRemove(recentExistingVideo),
                            });

                        // Add updated record
                        await firestore()
                            .collection('User_Accounts')
                            .doc(userId)
                            .update({
                                watchedVideos: firestore.FieldValue.arrayUnion(watchedVideoData),
                            });
                        console.log('Updated existing video history with higher percentage:', percentageWatched);
                    } else {
                        console.log('No update needed - existing percentage is higher or equal');
                    }
                } else {
                    // Add new video to history
                    await firestore()
                        .collection('User_Accounts')
                        .doc(userId)
                        .update({
                            watchedVideos: firestore.FieldValue.arrayUnion(watchedVideoData),
                        });
                    console.log('Video successfully saved to history:', uniqueId);
                }
            }

            // Mark video as saved to prevent duplicate saves
            videoSavedRef.current = true;
        } catch (error) {
            console.error('Error saving watched video to User_Accounts:', error);
        } finally {
            isSavingRef.current = false;
        }
    }, [video, lessonTitle, videoDuration]);

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

    const onStateChange = useCallback((state: string) => {
        console.log('YouTube player state changed:', state);

        if (state === 'playing') {
            setPlaying(true);

            if (playStartTimeRef.current === null) {
                playStartTimeRef.current = Date.now();
                console.log('Video playback started, starting timer');
            }
        } else if (state === 'paused' || state === 'ended' || state === 'stopped') {
            setPlaying(false);

            // Check if we've played enough to mark as watched
            checkPlayDuration();

            // Check progress and award points when paused
            checkWatchingProgress();

            if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                saveWatchedVideo();
            }

            // If video ended, make sure we award points for what they've watched
            if (state === 'ended') {
                // Give benefit of the doubt - if they watched till the end,
                // consider it 100% watched (in case of tracking issues)
                watchedDurationRef.current = videoDuration;
                setCurrentPercentage(100);

                // Immediate check for points
                checkWatchingProgress();

                // If video ended but points weren't awarded for some reason
                if (lastPointsPercentageRef.current < 100) {
                    const maxPoints = calculatePoints(100, videoDuration);

                    // Navigate to PointsScreen after a short delay
                    setTimeout(() => {
                        navigation.navigate('PointsScreen', {
                            points: totalPointsEarnedRef.current > 0 ? totalPointsEarnedRef.current : maxPoints,
                            totalPoints: maxPoints,
                            videoTitle: video.title
                        });
                    }, 1000);
                }
            }
        }
    }, [checkPlayDuration, saveWatchedVideo, checkWatchingProgress, videoDuration, navigation, video.title]);

    // Set up regular interval to check watching progress for points
    useEffect(() => {
        // Only start interval when video is playing and duration is known
        if (playing && videoDuration > 0) {
            checkPointsIntervalRef.current = setInterval(() => {
                checkWatchingProgress();
            }, 5000); // Check every 5 seconds
        } else if (checkPointsIntervalRef.current) {
            clearInterval(checkPointsIntervalRef.current);
            checkPointsIntervalRef.current = null;
        }

        return () => {
            if (checkPointsIntervalRef.current) {
                clearInterval(checkPointsIntervalRef.current);
                checkPointsIntervalRef.current = null;
            }
        };
    }, [playing, videoDuration, checkWatchingProgress]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isFocused) {
                checkPlayDuration();
                checkWatchingProgress();
                if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                    saveWatchedVideo();
                }
                navigation.goBack();
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [isFocused, navigation, checkPlayDuration, saveWatchedVideo, checkWatchingProgress]);

    useFocusEffect(
        useCallback(() => {
            // Start position polling when screen is focused
            startPositionPolling();

            return () => {
                console.log('VideoPlayer screen is losing focus');
                checkPlayDuration();
                checkWatchingProgress();

                if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                    console.log('Saving video on navigation away');
                    saveWatchedVideo();
                }

                // Clear position polling
                if (positionPollingRef.current) {
                    clearInterval(positionPollingRef.current);
                    positionPollingRef.current = null;
                }
            };
        }, [checkPlayDuration, saveWatchedVideo, checkWatchingProgress, startPositionPolling])
    );

    useEffect(() => {
        const watchTimer = setInterval(() => {
            if (playing && playStartTimeRef.current !== null) {
                checkPlayDuration();
            }
        }, 1000);

        return () => clearInterval(watchTimer);
    }, [playing, checkPlayDuration]);

    useEffect(() => {
        return () => {
            console.log('Component unmounting, final save check');
            checkWatchingProgress();

            if (hasPlayedEnoughRef.current && !videoSavedRef.current && !isSavingRef.current) {
                saveWatchedVideo();
            }

            // Clean up all intervals
            if (positionPollingRef.current) {
                clearInterval(positionPollingRef.current);
            }
            if (checkPointsIntervalRef.current) {
                clearInterval(checkPointsIntervalRef.current);
            }
        };
    }, [saveWatchedVideo, checkWatchingProgress]);

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
                            checkWatchingProgress();
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
                            onReady={onPlayerReady}
                            ref={videoPlayerRef}
                            forceAndroidAutoplay={true}
                        />
                    </View>

                    <View style={styles.videoInfoContainer}>
                        <Text style={styles.videoTitle}>{video.title}</Text>
                        <Text style={styles.lessonSubtitle}>{lessonTitle}</Text>
                        {videoDuration > 0 && (
                            <Text style={styles.durationText}>
                                Duration: {Math.floor(videoDuration / 60)}:{String(Math.floor(videoDuration % 60)).padStart(2, '0')}
                            </Text>
                        )}
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                {currentPercentage > 0
                                    ? `You've watched ${currentPercentage}% of this video`
                                    : "Start watching to track progress"}
                            </Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${currentPercentage}%` }]} />
                            </View>
                            {lastPointsPercentageRef.current > 0 && (
                                <Text style={styles.pointsText}>
                                    Points earned for reaching {lastPointsPercentageRef.current}% milestone
                                </Text>
                            )}
                        </View>
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
    headerTextContainer: {
        flex: 1,
        marginLeft: 12,
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
        marginBottom: 8,
    },
    durationText: {
        fontSize: 14,
        color: '#4A6D8C',
        marginTop: 4,
        marginBottom: 12,
    },
    progressContainer: {
        marginTop: 12,
    },
    progressText: {
        fontSize: 14,
        color: '#003366',
        marginBottom: 6,
    },
    pointsText: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 6,
        fontWeight: '500',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E1EEFB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
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