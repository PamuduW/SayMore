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
  Alert,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WatchedVideo } from '../types/types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { throttle } from 'lodash';
import { useTheme } from '../components/ThemeContext';

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
  LessonsPointsScreen: {
    points: number;
    videoTitle: string;
    milestones: number[];
    maxPossiblePoints: number;
  };
  Home: undefined;
};

type VideoPlayerRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;
type VideoPlayerNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VideoPlayer'
>;

interface VideoPlayerScreenProps {
  route: VideoPlayerRouteProp;
  navigation: VideoPlayerNavigationProp;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  route,
  navigation,
}) => {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const { video, lessonTitle } = route.params;
  const { width, height } = Dimensions.get('window');
  const playerHeight = height * 0.3;
  const playerWidth = width;
  const [playing, setPlaying] = useState(false);
  const videoPlayerRef = useRef<any>(null);

  const playStartTimeRef = useRef<number | null>(null);
  const hasPlayedEnoughRef = useRef<boolean>(false);
  const isSavingRef = useRef<boolean>(false);
  const videoSavedRef = useRef<boolean>(false);

  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const lastWatchTimeRef = useRef<number>(0);
  const watchedDurationRef = useRef<number>(0);
  const pointsAwardedRef = useRef<boolean>(false);
  const checkPointsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const totalPointsEarnedRef = useRef<number>(0);
  const positionPollingRef = useRef<NodeJS.Timeout | null>(null);
  const previousTimeRef = useRef(0);
  const [largestMilestone, setLargestMilestone] = useState(0);

  // New state for previously watched percentage
  const [previousWatchedPercentage, setPreviousWatchedPercentage] = useState<
    number | null
  >(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null); // Track the current VideoId
  const [isRewatching, setIsRewatching] = useState(false); // New state to track if rewatching a completed video

  // Reference to completed video entry if exists
  const completedVideoEntryRef = useRef<WatchedVideo | null>(null);
  const skipOccurredRef = useRef(false); // Define skipOccurredRef

  const combinedTitle = `${lessonTitle} - ${video.title}`;

  const showNotification = useCallback((message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('', message);
    }
  }, []);

  const calculateMaxPoints = (durationInSeconds: number): number => {
    let maxPoints = 6;

    if (durationInSeconds > 3600) {
      maxPoints = 10;
    } else if (durationInSeconds > 1800) {
      maxPoints = 8;
    } else if (durationInSeconds > 600) {
      maxPoints = 7;
    }

    return maxPoints;
  };

  const calculateCompletionPoints = useCallback(() => {
    const maxCompletionPoints = calculateMaxPoints(videoDuration);

    let basePoints = Array.from(reachedMilestonesRef.current).filter(
      milestone => milestone !== 100
    ).length;
    let completionBonus = maxCompletionPoints - basePoints;

    if (completionBonus < 0) {
      completionBonus = 0;
    }

    return completionBonus;
  }, [videoDuration]);

  const awardPoints = useCallback(
    async (points: number, milestone: number) => {
      try {
        const user = auth().currentUser;
        if (!user) {
          //console.log('No user logged in, cannot award points');
          return;
        }

        const userId = user.uid;
        totalPointsEarnedRef.current += points;

        await firestore()
          .collection('User_Accounts')
          .doc(userId)
          .update({
            points: firestore.FieldValue.increment(points),
            pointsHistory: firestore.FieldValue.arrayUnion({
              videoId: video.videoId,
              videoTitle: video.title,
              lessonTitle: lessonTitle,
              pointsEarned: points,
              milestone: milestone,
              timestamp: new Date().toISOString(),
            }),
          });

        if (milestone === 100) {
          showNotification(`Video completed! You earned ${points} points!`);
        } else {
          showNotification(`${milestone}% milestone reached! +${points} point`);
        }
      } catch (error) {
        //console.error('Error awarding points:', error);
      }
    },
    [video, lessonTitle, showNotification]
  );

  const checkWatchingProgress = useCallback(async () => {
    if (
      !videoPlayerRef.current ||
      pointsAwardedRef.current ||
      videoDuration === 0
    ) {
      return;
    }

    try {
      const currentPlaybackTime = await videoPlayerRef.current.getCurrentTime();

      if (playing && lastWatchTimeRef.current > 0) {
        const timeIncrement = currentPlaybackTime - lastWatchTimeRef.current;
        // More generous upper limit for time increments
        if (timeIncrement > 0 && timeIncrement < 30) {
          watchedDurationRef.current += timeIncrement;
        }
      }
      lastWatchTimeRef.current = currentPlaybackTime;

      const percentageWatched = Math.min(
        100,
        Math.round((watchedDurationRef.current / videoDuration) * 100)
      );

      const milestones = [10, 25, 50, 75, 100];

      //Only check for milestones and award points always
      for (const milestone of milestones) {
        if (
          percentageWatched >= milestone &&
          !reachedMilestonesRef.current.has(milestone)
        ) {
          reachedMilestonesRef.current.add(milestone);

          setLargestMilestone(milestone);

          await awardPoints(1, milestone);
        }
      }

      if (largestMilestone < percentageWatched) {
        setLargestMilestone(percentageWatched);
      }
    } catch (error) {
      //console.error('Error checking watching progress:', error);
    }
  }, [playing, videoDuration, awardPoints, largestMilestone]);

  const throttledSetCurrentPercentage = useCallback(
    throttle((percentage: number) => {
      setCurrentPercentage(percentage);
    }, 500),
    []
  );

  // Poll video position regularly to update progress
  const startPositionPolling = useCallback(() => {
    if (positionPollingRef.current) {
      clearInterval(positionPollingRef.current);
    }

    positionPollingRef.current = setInterval(async () => {
      if (videoPlayerRef.current && playing) {
        try {
          const currentTime = await videoPlayerRef.current.getCurrentTime();

          // The important change: Only prevent skipping if we haven't just skipped to the last watched position.
          if (
            currentTime > previousTimeRef.current &&
            !skipOccurredRef.current
          ) {
            // Add check for skipOccurredRef
            let allowedSkip = false;

            const largestMilestoneTime =
              (largestMilestone / 100) * videoDuration;
            if (currentTime <= largestMilestoneTime) {
              allowedSkip = true;
            }

            if (!allowedSkip && currentTime - previousTimeRef.current > 3) {
              videoPlayerRef.current.seekTo(previousTimeRef.current);
              //console.log('Preventing forward skip!');

              showNotification(
                'Cannot skip forward. Watch the content sequentially.'
              );

              return;
            }
          }

          previousTimeRef.current = currentTime;

          // Update watchedDurationRef based on the current time, not just when skipping
          watchedDurationRef.current = currentTime;

          const percentageWatched = Math.min(
            100,
            Math.round((watchedDurationRef.current / videoDuration) * 100)
          );
          throttledSetCurrentPercentage(percentageWatched);
        } catch (error) {
          //console.error('Error polling video position:', error);
        }
      }
    }, 1000);

    return () => {
      if (positionPollingRef.current) {
        clearInterval(positionPollingRef.current);
        positionPollingRef.current = null;
      }
    };
  }, [
    playing,
    videoDuration,
    throttledSetCurrentPercentage,
    showNotification,
    largestMilestone,
  ]);

  // Get previously watched percentage from Firestore
  const fetchPreviousWatchedPercentage = useCallback(async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        return;
      }

      const userId = user.uid;
      const userDoc = await firestore()
        .collection('User_Accounts')
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const watchedVideos = userData?.watchedVideos || [];

        // Find completed video entry (98% or higher)
        const completedVideoEntry = watchedVideos.find(
          (v: WatchedVideo) =>
            v.videoId === video.videoId && v.percentageWatched >= 98
        );

        // Find latest incomplete entry
        const incompleteEntries = watchedVideos
          .filter(
            (v: WatchedVideo) =>
              v.videoId === video.videoId && v.percentageWatched < 98
          )
          .sort((a: WatchedVideo, b: WatchedVideo) => {
            // Sort by timestamp descending to get the most recent
            return (
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          });

        const latestIncompleteEntry =
          incompleteEntries.length > 0 ? incompleteEntries[0] : null;

        if (completedVideoEntry) {
          //console.log('Found completed video entry');
          completedVideoEntryRef.current = completedVideoEntry;

          setIsRewatching(true);

          // Initialize milestones and points earned for rewatch.
          reachedMilestonesRef.current = new Set();
          totalPointsEarnedRef.current = 0;

          // Check if there's also an incomplete rewatching entry
          if (latestIncompleteEntry) {
            const incompletePercentage =
              latestIncompleteEntry.percentageWatched;

            if (incompletePercentage >= 5) {
              setPreviousWatchedPercentage(incompletePercentage);
              setShowSkipButton(true);
              setCurrentPercentage(incompletePercentage);
              watchedDurationRef.current =
                (incompletePercentage / 100) * videoDuration;
            } else {
              // Start from beginning for very low progress
              setShowSkipButton(false);
              setPreviousWatchedPercentage(null);
              setCurrentPercentage(0);
              watchedDurationRef.current = 0;
            }
          } else {
            // First time rewatching after completion
            setShowSkipButton(false);
            setPreviousWatchedPercentage(null);
            setCurrentPercentage(0);
            watchedDurationRef.current = 0;
          }
        } else if (latestIncompleteEntry) {
          // No completion but has incomplete progress
          const incompletePercentage = latestIncompleteEntry.percentageWatched;

          if (incompletePercentage >= 5) {
            setPreviousWatchedPercentage(incompletePercentage);
            setShowSkipButton(true);
            setCurrentPercentage(incompletePercentage);
            watchedDurationRef.current =
              (incompletePercentage / 100) * videoDuration;
            //Also re-initialize milestones when starting mid-way
            const milestones = [10, 25, 50, 75, 100];
            for (const milestone of milestones) {
              if (incompletePercentage >= milestone) {
                reachedMilestonesRef.current.add(milestone);
              }
            }
          } else {
            setShowSkipButton(false);
            setPreviousWatchedPercentage(null);
            setCurrentPercentage(0);
            watchedDurationRef.current = 0;
          }
        } else {
          // First time watching this video
          setShowSkipButton(false);
          setPreviousWatchedPercentage(null);
          setCurrentPercentage(0);
          watchedDurationRef.current = 0;
        }
      }
    } catch (error) {
      //console.error('Error fetching previous watched percentage:', error);
    }
  }, [video.videoId, videoDuration]);

  // Skip to previously watched position
  const skipToLastWatched = useCallback(async () => {
    if (videoPlayerRef.current && previousWatchedPercentage && videoDuration) {
      try {
        const skipToTime = (previousWatchedPercentage / 100) * videoDuration;

        const targetTime = Math.max(0, skipToTime - 2);

        //console.log('Previous watched percentage:', previousWatchedPercentage);
        //console.log('Video duration:', videoDuration);
        //console.log('Skipping to time:', targetTime);

        await videoPlayerRef.current.seekTo(targetTime);

        skipOccurredRef.current = true;

        setTimeout(() => {
          skipOccurredRef.current = false;
        }, 1000);

        watchedDurationRef.current = targetTime;

        setCurrentPercentage(previousWatchedPercentage);

        previousTimeRef.current = targetTime;

        // Update the largest milestone based on the previous watched percentage
        const milestones = [10, 25, 50, 75, 100];
        for (const milestone of milestones) {
          if (previousWatchedPercentage >= milestone) {
            reachedMilestonesRef.current.add(milestone);
            setLargestMilestone(milestone);
          }
        }

        showNotification(
          `Skipped to ${previousWatchedPercentage}% of the video`
        );
        setShowSkipButton(false);
      } catch (error) {
        //console.error('Error skipping to previous position:', error);
        showNotification('Could not skip to previous position');
      }
    }
  }, [previousWatchedPercentage, videoDuration, showNotification]);

  const onPlayerReady = useCallback(async () => {
    try {
      if (videoPlayerRef.current) {
        const duration = await videoPlayerRef.current.getDuration();
        //console.log('Video duration:', duration, 'seconds');
        setVideoDuration(duration);

        // Start position polling once we have duration
        startPositionPolling();

        // Fetch previously watched percentage for this video
        await fetchPreviousWatchedPercentage();

        videoSavedRef.current = false;
        hasPlayedEnoughRef.current = false;

        // Initialize CurrentVideoId with a unique ID for current session
        const timestamp = new Date().getTime(); // Add timestamp to make the ID unique for rewatching
        setCurrentVideoId(`${video.videoId}_${timestamp}`);
      }
    } catch (error) {
      //console.error('Error getting video duration:', error);
    }
  }, [startPositionPolling, fetchPreviousWatchedPercentage, video.videoId]);

  const saveWatchedVideo = useCallback(async () => {
    //console.log('saveWatchedVideo called');

    if (isSavingRef.current) {
      //console.log('Skipping save: currently saving');
      return;
    }

    if (!currentVideoId) {
      //console.log('No currentVideoId. Aborting saveWatchedVideo.');
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      //console.log('No user is currently signed in. Aborting saveWatchedVideo.');
      return;
    }

    // Set saving flag immediately to prevent concurrent save attempts
    isSavingRef.current = true;
    //console.log('Starting to save video to history');

    const now = new Date();
    const timestamp = now.toLocaleString();
    const userId = user.uid;
    //console.log('Saving video to history for User ID:', userId);

    const actualPercentage =
      videoDuration > 0
        ? Math.min(100, (watchedDurationRef.current / videoDuration) * 100)
        : 0;

    const percentageWatched = Math.round(actualPercentage * 10) / 10;

    const watchedVideoData: WatchedVideo = {
      videoId: video.videoId,
      title: video.title,
      lessonTitle: lessonTitle,
      timestamp: timestamp,
      thumbnail: video.thumbnail || '',
      id: currentVideoId, // Use unique session ID
      percentageWatched: percentageWatched,
    };

    try {
      const userDoc = await firestore()
        .collection('User_Accounts')
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        let existingVideos = userData?.watchedVideos || [];

        // Handle saving for a rewatch session
        if (isRewatching) {
          //console.log('Handling save for rewatch session');

          // If this is a finished rewatch (100%)
          if (percentageWatched >= 98) {
            //console.log('Rewatch completed to 100%');

            // Find any incomplete rewatch entries (not the completed one)
            const incompleteRewatchEntries = existingVideos.filter(
              (v: WatchedVideo) =>
                v.videoId === video.videoId &&
                v.percentageWatched < 98 &&
                v.id !== completedVideoEntryRef.current?.id
            );

            // Remove any incomplete rewatch entries
            for (const entry of incompleteRewatchEntries) {
              await firestore()
                .collection('User_Accounts')
                .doc(userId)
                .update({
                  watchedVideos: firestore.FieldValue.arrayRemove(entry),
                });
            }

            // Add new completed rewatch entry
            await firestore()
              .collection('User_Accounts')
              .doc(userId)
              .update({
                watchedVideos:
                  firestore.FieldValue.arrayUnion(watchedVideoData),
              });
          } else {
            const existingRewatchEntry = existingVideos.find(
              (v: WatchedVideo) =>
                v.videoId === video.videoId &&
                v.percentageWatched < 98 &&
                v.id !== completedVideoEntryRef.current?.id
            );

            if (existingRewatchEntry) {
              // Only update if new percentage is higher
              if (percentageWatched > existingRewatchEntry.percentageWatched) {
                // Remove existing rewatch entry
                await firestore()
                  .collection('User_Accounts')
                  .doc(userId)
                  .update({
                    watchedVideos:
                      firestore.FieldValue.arrayRemove(existingRewatchEntry),
                  });

                // Add updated rewatch entry
                await firestore()
                  .collection('User_Accounts')
                  .doc(userId)
                  .update({
                    watchedVideos:
                      firestore.FieldValue.arrayUnion(watchedVideoData),
                  });
              } else {
              }
            } else {
              await firestore()
                .collection('User_Accounts')
                .doc(userId)
                .update({
                  watchedVideos:
                    firestore.FieldValue.arrayUnion(watchedVideoData),
                });

              //console.log('Added new incomplete rewatch entry');
            }
          }
        } else {
          // Handle save for first-watch session
          //console.log('Handling save for first-watch session');

          const existingVideoIndex = existingVideos.findIndex(
            (v: WatchedVideo) => v.videoId === video.videoId
          );

          if (existingVideoIndex !== -1) {
            const existingVideo = existingVideos[existingVideoIndex];
            const existingPercentage = existingVideo.percentageWatched || 0;

            //console.log(`Current percentage watched: ${percentageWatched}%`);

            // Only update if new percentage is higher
            if (percentageWatched > existingPercentage) {
              // Remove existing entry
              await firestore()
                .collection('User_Accounts')
                .doc(userId)
                .update({
                  watchedVideos:
                    firestore.FieldValue.arrayRemove(existingVideo),
                });

              // Add updated entry
              await firestore()
                .collection('User_Accounts')
                .doc(userId)
                .update({
                  watchedVideos:
                    firestore.FieldValue.arrayUnion(watchedVideoData),
                });
            } else {
            }
          } else {
            // Add new entry for first watch
            await firestore()
              .collection('User_Accounts')
              .doc(userId)
              .update({
                watchedVideos:
                  firestore.FieldValue.arrayUnion(watchedVideoData),
              });

            //console.log('Added new first-watch entry');
          }
        }

        videoSavedRef.current = true;
        //console.log('videoSavedRef.current set to true');
      } else {
        //console.log("User Doc Doesn't Exist!");
      }
    } catch (error) {
      //console.error('Error saving watched video to User_Accounts:', error);
    } finally {
      isSavingRef.current = false;
      //console.log('isSavingRef.current set to false');
    }
  }, [video, lessonTitle, videoDuration, currentVideoId, isRewatching]);

  const checkPlayDuration = useCallback(() => {
    if (playStartTimeRef.current !== null && !hasPlayedEnoughRef.current) {
      const playDuration = Date.now() - playStartTimeRef.current;
      if (playDuration >= 1000) {
        //console.log(`Video played for ${playDuration}ms - marking as watched`);
        hasPlayedEnoughRef.current = true;
      }
    }
  }, []);

  const resetWatchingState = useCallback(() => {
    watchedDurationRef.current = 0;
    setCurrentPercentage(0);
    lastWatchTimeRef.current = 0;
    reachedMilestonesRef.current = new Set();
    totalPointsEarnedRef.current = 0;
    setLargestMilestone(0);
    setShowSkipButton(false);
    setPreviousWatchedPercentage(null);

    hasPlayedEnoughRef.current = false;
    videoSavedRef.current = false;
    playStartTimeRef.current = null;

    // Generate a new unique ID for the next watch session
    const timestamp = new Date().getTime();
    setCurrentVideoId(`${video.videoId}_${timestamp}`);
  }, [video.videoId]);

  const onStateChange = useCallback(
    async (state: string) => {
      //console.log('YouTube player state changed:', state);

      if (state === 'playing') {
        setPlaying(true);
        setShowSkipButton(false);

        if (playStartTimeRef.current === null) {
          playStartTimeRef.current = Date.now();
          //console.log('Video playback started, starting timer');
        }
      } else if (
        state === 'paused' ||
        state === 'ended' ||
        state === 'stopped'
      ) {
        setPlaying(false);

        checkPlayDuration();
        await checkWatchingProgress();

        if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
          await saveWatchedVideo();
        }

        if (state === 'ended') {
          watchedDurationRef.current = videoDuration;
          setCurrentPercentage(100);
          //console.log('Total points earned:', totalPointsEarnedRef.current);

          reachedMilestonesRef.current.add(100);
          const milestoneCompletionPoints = calculateCompletionPoints();

          totalPointsEarnedRef.current += milestoneCompletionPoints;

          const finalPoints = totalPointsEarnedRef.current;

          await awardPoints(milestoneCompletionPoints, 100);

          try {
            navigation.navigate('LessonsPointsScreen', {
              points: finalPoints,
              videoTitle: video.title,
              milestones: Array.from(reachedMilestonesRef.current),
              maxPossiblePoints: calculateMaxPoints(videoDuration),
            });
          } catch (error) {
            //console.error('Error navigating to LessonsPointsScreen:', error);
            showNotification(
              'Error showing points screen. Please try again later.'
            );
          }

          resetWatchingState();
          setIsRewatching(false);
        }
      }
    },
    [
      checkPlayDuration,
      saveWatchedVideo,
      checkWatchingProgress,
      videoDuration,
      navigation,
      video.title,
      awardPoints,
      calculateCompletionPoints,
      resetWatchingState,
      showNotification,
    ]
  );

  // Set up regular interval to check watching progress for points
  useEffect(() => {
    if (playing && videoDuration > 0) {
      checkPointsIntervalRef.current = setInterval(() => {
        checkWatchingProgress();
      }, 5000);
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
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
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
      }
    );

    return () => backHandler.remove();
  }, [
    isFocused,
    navigation,
    checkPlayDuration,
    saveWatchedVideo,
    checkWatchingProgress,
  ]);

  useFocusEffect(
    useCallback(() => {
      startPositionPolling();
      videoSavedRef.current = false;
      hasPlayedEnoughRef.current = false;

      return () => {
        //console.log('VideoPlayer screen is losing focus');
        checkPlayDuration();
        checkWatchingProgress();

        if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
          //console.log('Saving video on navigation away');
          saveWatchedVideo();
        }

        if (positionPollingRef.current) {
          clearInterval(positionPollingRef.current);
          positionPollingRef.current = null;
        }
      };
    }, [
      checkPlayDuration,
      saveWatchedVideo,
      checkWatchingProgress,
      startPositionPolling,
    ])
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
      //console.log('Component unmounting, final save check');
      checkWatchingProgress();

      if (
        hasPlayedEnoughRef.current &&
        !videoSavedRef.current &&
        !isSavingRef.current
      ) {
        saveWatchedVideo();
      }

      if (positionPollingRef.current) {
        clearInterval(positionPollingRef.current);
      }
      if (checkPointsIntervalRef.current) {
        clearInterval(checkPointsIntervalRef.current);
      }
    };
  }, [saveWatchedVideo, checkWatchingProgress]);

  const milestoneColors = {
    10: '#E91E63',
    25: '#9C27B0',
    50: '#3F51B5',
    75: '#2196F3',
    100: '#4CAF50',
  };

  const getProgressFillColor = (percentage: number) => {
    if (percentage <= 25) {
      return milestoneColors[10];
    } else if (percentage <= 50) {
      return milestoneColors[25];
    } else if (percentage <= 75) {
      return milestoneColors[50];
    } else {
      return milestoneColors[75];
    }
  };

  const getMilestonePointsText = () => {
    if (isRewatching) {
      return 'Rewatching';
    }

    if (reachedMilestonesRef.current.size === 0) {
      return '';
    }

    const milestones = Array.from(reachedMilestonesRef.current).sort(
      (a, b) => a - b
    );
    const lastMilestone = milestones[milestones.length - 1];

    if (lastMilestone === 100) {
      return 'Completed! Points earned based on video duration.';
    } else {
      return `Points earned for reaching ${lastMilestone}% milestone`;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
      <View style={theme === 'dark' ? styles.darkContainer : styles.container}>
        <View style={theme === 'dark' ? styles.darkHeader : styles.header}>
          <TouchableOpacity
            style={
              theme === 'light' ? styles.lightBackButton : styles.darkBackButton
            }
            onPress={() => {
              checkPlayDuration();
              checkWatchingProgress();
              if (hasPlayedEnoughRef.current && !videoSavedRef.current) {
                saveWatchedVideo();
              }
              navigation.goBack();
            }}>
            <Text
              style={
                theme === 'dark'
                  ? styles.darkBackButtonText
                  : styles.lightBackButtonText
              }>
              ←
            </Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text
              style={
                theme === 'dark' ? styles.darkHeaderText : styles.headerText
              }
              numberOfLines={1}
              ellipsizeMode="tail">
              {combinedTitle}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View
            style={
              theme === 'dark'
                ? styles.darkVideoContainer
                : styles.videoContainer
            }>
            <YoutubeIframe
              height={playerHeight}
              width={playerWidth}
              videoId={video.videoId}
              play={playing}
              onChangeState={onStateChange}
              onReady={onPlayerReady}
              ref={videoPlayerRef}
              forceAndroidAutoplay={true}
              webViewProps={{
                allowsFullscreen: false,
              }}
            />
          </View>

          {showSkipButton && previousWatchedPercentage && !playing && (
            <TouchableOpacity
              style={
                theme === 'dark' ? styles.darkSkipButton : styles.skipButton
              }
              onPress={skipToLastWatched}>
              <Text style={styles.skipButtonText}>
                Skip to {previousWatchedPercentage}% (Last Watched)
              </Text>
            </TouchableOpacity>
          )}

          <View
            style={
              theme === 'dark'
                ? styles.darkVideoInfoContainer
                : styles.videoInfoContainer
            }>
            <Text
              style={
                theme === 'dark' ? styles.darkVideoTitle : styles.videoTitle
              }>
              {video.title}
            </Text>
            <Text
              style={
                theme === 'dark'
                  ? styles.darkLessonSubtitle
                  : styles.darkLessonSubtitle
              }>
              {lessonTitle}
            </Text>
            {videoDuration > 0 && (
              <Text
                style={
                  theme === 'dark'
                    ? styles.darkDurationText
                    : styles.durationText
                }>
                Duration: {Math.floor(videoDuration / 60)}:
                {String(Math.floor(videoDuration % 60)).padStart(2, '0')}
              </Text>
            )}
            <View style={styles.progressContainer}>
              <Text
                style={
                  theme === 'dark'
                    ? styles.darkProgressText
                    : styles.progressText
                }>
                {currentPercentage > 0
                  ? `You've watched ${currentPercentage}% of this video`
                  : 'Start watching to track progress'}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${currentPercentage}%`,
                      backgroundColor: getProgressFillColor(currentPercentage),
                    },
                  ]}
                />
              </View>
              {reachedMilestonesRef.current.size > 0 && (
                <Text style={styles.pointsText}>
                  {getMilestonePointsText()}
                </Text>
              )}
              <View
                style={
                  theme === 'dark'
                    ? styles.darkMilestonesContainer
                    : styles.milestonesContainer
                }>
                <Text
                  style={
                    theme === 'dark'
                      ? styles.darkMilestonesText
                      : styles.milestonesText
                  }>
                  Milestones:
                  <Text
                    style={
                      reachedMilestonesRef.current.has(10)
                        ? styles.reachedMilestone
                        : theme === 'dark'
                          ? styles.darkUnreachedMilestone
                          : styles.unreachedMilestone
                    }>
                    {' '}
                    10%
                  </Text>{' '}
                  |
                  <Text
                    style={
                      reachedMilestonesRef.current.has(25)
                        ? styles.reachedMilestone
                        : theme === 'dark'
                          ? styles.darkUnreachedMilestone
                          : styles.unreachedMilestone
                    }>
                    {' '}
                    25%
                  </Text>{' '}
                  |
                  <Text
                    style={
                      reachedMilestonesRef.current.has(50)
                        ? styles.reachedMilestone
                        : theme === 'dark'
                          ? styles.darkUnreachedMilestone
                          : styles.unreachedMilestone
                    }>
                    {' '}
                    50%
                  </Text>{' '}
                  |
                  <Text
                    style={
                      reachedMilestonesRef.current.has(75)
                        ? styles.reachedMilestone
                        : theme === 'dark'
                          ? styles.darkUnreachedMilestone
                          : styles.unreachedMilestone
                    }>
                    {' '}
                    75%
                  </Text>{' '}
                  |
                  <Text
                    style={
                      reachedMilestonesRef.current.has(100)
                        ? styles.reachedMilestone
                        : theme === 'dark'
                          ? styles.darkUnreachedMilestone
                          : styles.unreachedMilestone
                    }>
                    {' '}
                    100%
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          {video.summary && (
            <View
              style={
                theme === 'dark'
                  ? styles.darkSummaryOuterContainer
                  : styles.summaryOuterContainer
              }>
              <View
                style={
                  theme === 'dark'
                    ? styles.darkSummaryHeaderContainer
                    : styles.summaryHeaderContainer
                }>
                <Text
                  style={
                    theme === 'dark'
                      ? styles.darkSummaryHeaderText
                      : styles.summaryHeaderText
                  }>
                  Summary
                </Text>
              </View>
              <View style={styles.summaryCardContainer}>
                {video.summaryImage && (
                  <Image
                    source={{ uri: video.summaryImage }}
                    style={styles.summaryImage}
                  />
                )}
                <Text
                  style={
                    theme === 'dark'
                      ? styles.darkSummaryText
                      : styles.summaryText
                  }>
                  {video.summary}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Add new styles for the skip button
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#2B2B2B',
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
  darkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2B2B2B',
    borderBottomWidth: 1,
    borderBottomColor: '#2B2B2B',
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
    paddingBottom: 2, // Fine-tune vertical centering
    lineHeight: 32, // Control line height to center text
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
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  darkHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  scrollContent: {
    flex: 1,
  },
  videoContainer: {
    alignItems: 'center',
    backgroundColor: '#003366',
    marginBottom: -45,
  },
  darkVideoContainer: {
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    marginBottom: -45,
  },
  darkSkipButton: {
    backgroundColor: '#4c4c4c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  videoInfoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1EEFB',
    marginBottom: 16,
  },
  darkVideoInfoContainer: {
    padding: 16,
    backgroundColor: '#2B2B2B',
    borderBottomWidth: 1,
    borderBottomColor: '#2B2B2B',
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  darkVideoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: 14,
    color: '#4A6D8C',
    marginBottom: 8,
  },
  darkLessonSubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#4A6D8C',
    marginTop: 4,
    marginBottom: 12,
  },
  darkDurationText: {
    fontSize: 14,
    color: '#FFF',
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
  darkProgressText: {
    fontSize: 14,
    color: '#FFF',
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
  milestonesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E1EEFB',
  },
  darkMilestonesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
  milestonesText: {
    fontSize: 12,
    color: '#003366',
  },
  darkMilestonesText: {
    fontSize: 12,
    color: '#FFF',
  },
  reachedMilestone: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  unreachedMilestone: {
    color: '#A0AEC0',
  },
  darkUnreachedMilestone: {
    color: '#FFF',
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
  darkSummaryOuterContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#3c3c3c',
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
  darkSummaryHeaderContainer: {
    backgroundColor: '#4d4d4d',
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
  darkSummaryHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
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
  darkSummaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFF',
  },
  skipButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 16,
  },
});

export default VideoPlayerScreen;
