import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Lesson, VideoItem, WatchedVideo } from '../types/types';

interface LessonRedirectionStutteringProps { }

const { width } = Dimensions.get('window');
const videoBoxWidth = (width - 75) / 3; // 3 boxes per row with spacing adjusted
const videoBoxMargin = 15; // Margin between video boxes
const containerPadding = 20; // Padding for the main container

const LessonRedirectionStuttering: React.FC<LessonRedirectionStutteringProps> = () => {
    const navigation = useNavigation();
    const [lastWatchedVideo, setLastWatchedVideo] = useState<WatchedVideo | null>(null);
    const [recommendedLessons, setRecommendedLessons] = useState<{
        category: string;
        documentId: string;
        videos: VideoItem[]
    }[]>([]);
    const [loading, setLoading] = useState(true);

    // **NEW: Function to fetch the most recent watched video**
    const fetchLastWatchedVideo = useCallback(async () => {
        try {
            const user = auth().currentUser;
            if (!user) {
                console.log('No user logged in');
                setLastWatchedVideo(null); // Clear any previous value
                return;
            }

            const userDoc = await firestore()
                .collection('User_Accounts')
                .doc(user.uid)
                .get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                const watchedVideos = userData?.watchedVideos as WatchedVideo[];

                if (watchedVideos && watchedVideos.length > 0) {
                    // Sort by timestamp to get the most recent
                    const sortedVideos = [...watchedVideos].sort((a, b) =>
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    ).reverse();  // **REVERSE THE ARRAY**

                    setLastWatchedVideo(sortedVideos[0] || null); // Use first or null
                } else {
                    console.log('No watched videos found.');
                    setLastWatchedVideo(null);
                }
            } else {
                console.log('User document does not exist.');
                setLastWatchedVideo(null);
            }
        } catch (error) {
            console.error('Error fetching last watched video:', error);
            setLastWatchedVideo(null); // Handle errors
        }
    }, []);

    const fetchVideoDetails = useCallback(async (videoId: string, lessonTitle: string): Promise<VideoItem | null> => {
        try {
            const lessonsSnapshot = await firestore().collection('lesson_videos').get();

            for (const doc of lessonsSnapshot.docs) {
                const lessonData = doc.data();
                if (lessonData.videos) {
                    const video = lessonData.videos.find((v: any) => v.videoId === videoId);
                    if (video) {
                        return video as VideoItem;  // Return the full VideoItem if found
                    }
                }
            }

            return null; // Video not found
        } catch (error) {
            console.error('Error fetching video details:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        const fetchRecommendedLessons = async () => {
            try {
                // Fetch all lesson categories for Stuttering
                const stutteringLessons = [
                    { title: 'Speech Exercises', documentId: 'speech_exercises' },
                    { title: 'Understanding Stuttering', documentId: 'understanding_stuttering' },
                    { title: 'Building Confidence', documentId: 'building_confidence' },
                    { title: 'Overcoming Stuttering', documentId: 'overcoming_stuttering' },
                ];

                const lessonsWithVideos = [];

                // Fetch videos for each lesson category
                for (const lesson of stutteringLessons) {
                    const documentSnapshot = await firestore()
                        .collection('lesson_videos')
                        .doc(lesson.documentId)
                        .get();

                    if (documentSnapshot.exists) {
                        const data = documentSnapshot.data();
                        if (data?.videos && data.videos.length > 0) {
                            lessonsWithVideos.push({
                                category: lesson.title,
                                documentId: lesson.documentId,
                                videos: data.videos
                            });
                        }
                    }
                }

                setRecommendedLessons(lessonsWithVideos);
            } catch (error) {
                console.error('Error fetching recommended lessons:', error);
            } finally {
                setLoading(false);
            }
        };
        const loadData = async () => {
            setLoading(true);
            await fetchLastWatchedVideo(); // Load last watched video first
            await fetchRecommendedLessons(); // Then load recommended lessons
            setLoading(false);
        };

        loadData();
    }, [fetchLastWatchedVideo]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleVideoPress = (video: VideoItem, lessonTitle: string, documentId: string) => {
        navigation.navigate('VideoPlayer', {
            video,
            lessonTitle: lessonTitle
        });
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.log('Invalid Date', dateString)
                return dateString // If it's invalid just return the original string
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // Ensure 12-hour format with AM/PM
            });
        } catch (e) {
            console.log("error in date string", dateString)
            return dateString; // If any error occurs during conversion
        }
    };

    const handleLastWatchedPress = useCallback(async () => {
        if (lastWatchedVideo) {
            setLoading(true);
            try {
                const videoDetails = await fetchVideoDetails(lastWatchedVideo.videoId, lastWatchedVideo.lessonTitle);

                if (videoDetails) {
                    navigation.navigate('VideoPlayer', {
                        video: videoDetails, // Pass the full video details
                        lessonTitle: lastWatchedVideo.lessonTitle
                    });
                } else {
                    console.log('Could not retrieve full video details for Last Watched. Using minimal info.');
                    // If full details are not available, you can still navigate with the basic info
                    navigation.navigate('VideoPlayer', {
                        video: {
                            videoId: lastWatchedVideo.videoId,
                            title: lastWatchedVideo.title,
                            thumbnail: lastWatchedVideo.thumbnail
                        },
                        lessonTitle: lastWatchedVideo.lessonTitle
                    });
                }
            } catch (error) {
                console.error('Error navigating to last watched video:', error);
                // If there is an error, navigate with the basic information available
                navigation.navigate('VideoPlayer', {
                    video: {
                        videoId: lastWatchedVideo.videoId,
                        title: lastWatchedVideo.title,
                        thumbnail: lastWatchedVideo.thumbnail
                    },
                    lessonTitle: lastWatchedVideo.lessonTitle
                });
            } finally {
                setLoading(false);
            }
        }
    }, [navigation, lastWatchedVideo, fetchVideoDetails]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBackPress}
                        >
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerText}>Stuttering</Text>
                        </View>
                    </View>

                    {loading ? (
                        <Text style={styles.loadingText}>Loading content...</Text>
                    ) : (
                        <>
                            {lastWatchedVideo ? (
                                <View style={styles.lastWatchedContainer}>
                                    <Text style={styles.sectionTitle}>Last Watched</Text>
                                    <View style={styles.lastWatchedContent}>
                                        <TouchableOpacity
                                            style={styles.lastWatchedVideoBox}
                                            onPress={handleLastWatchedPress} // Call the function that also fetches details
                                        >
                                            <Image
                                                source={{ uri: lastWatchedVideo.thumbnail }}
                                                style={styles.lastWatchedThumbnail}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                        <View style={styles.lastWatchedInfo}>
                                            <Text style={styles.lastWatchedTitle} numberOfLines={2}>
                                                {lastWatchedVideo.title}
                                            </Text>
                                            <Text style={styles.lastWatchedSubtitle}>
                                                {lastWatchedVideo.lessonTitle}
                                            </Text>
                                            <Text style={styles.lastWatchedTimestamp}>
                                                {formatDate(lastWatchedVideo.timestamp)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.noLastWatchedContainer}>
                                    <Text style={styles.noLastWatchedText}>
                                        No videos watched yet. Start watching to see your history!
                                    </Text>
                                </View>
                            )}

                            <View style={styles.recommendedContainer}>
                                <Text style={styles.recommendedTitle}>Lessons You Might Be Interested In</Text>

                                {recommendedLessons.length > 0 ? (
                                    <>
                                        {recommendedLessons.map((lessonCategory, categoryIndex) => (
                                            <View key={categoryIndex} style={styles.categoryContainer}>
                                                <Text style={styles.categoryTitle}>{lessonCategory.category}</Text>
                                                <View style={styles.videosGrid}>
                                                    {lessonCategory.videos.map((video, videoIndex) => (
                                                        <TouchableOpacity
                                                            key={videoIndex}
                                                            style={[
                                                                styles.videoBox,
                                                                { width: videoBoxWidth, marginRight: videoBoxMargin }, // Apply dynamic width and margin
                                                                videoIndex % 3 === 2 ? { marginRight: 0 } : null, // Remove right margin for the last video in each row
                                                            ]}
                                                            onPress={() => handleVideoPress(video, lessonCategory.category, lessonCategory.documentId)}
                                                        >
                                                            <Image
                                                                source={{ uri: video.thumbnail }}
                                                                style={styles.videoThumbnail}
                                                                resizeMode="cover"
                                                            />
                                                            <Text style={styles.videoTitle} numberOfLines={2}>
                                                                {video.title}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                ) : (
                                    <Text style={styles.noLessonsText}>No recommended lessons available.</Text>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
safeArea: {
flex: 1,
backgroundColor: '#F9FBFC',
},
scrollContainer: {
paddingBottom: 20,
},
container: {
flex: 1,
backgroundColor: '#F0F8FF',
padding: containerPadding,
},
headerContainer: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 16,
},
headerTextContainer: {
flex: 1,
marginLeft: 10,
},
headerText: {
fontSize: 28,
fontWeight: 'bold',
color: '#2C3E50',
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
lastWatchedContainer: {
backgroundColor: '#FFFFFF',
borderRadius: 16,
padding: 16,
marginBottom: 24,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 6,
elevation: 4,
},
sectionTitle: {
fontSize: 18,
fontWeight: '700',
color: '#2C3E50',
marginBottom: 12,
},
lastWatchedContent: {
flexDirection: 'row',
},
lastWatchedVideoBox: {
width: 120,
height: 90,
borderRadius: 10,
overflow: 'hidden',
backgroundColor: '#E1EEFB',
},
lastWatchedThumbnail: {
width: '100%',
height: '100%',
},
lastWatchedInfo: {
flex: 1,
marginLeft: 16,
justifyContent: 'space-between',
},
lastWatchedTitle: {
fontSize: 16,
fontWeight: '600',
color: '#34495E',
},
lastWatchedSubtitle: {
fontSize: 14,
color: '#7F8C8D',
marginTop: 4,
},
lastWatchedTimestamp: {
fontSize: 12,
color: '#95A5A6',
marginTop: 4,
},
noLastWatchedContainer: {
backgroundColor: '#FFFFFF',
borderRadius: 16,
padding: 16,
marginBottom: 24,
alignItems: 'center',
justifyContent: 'center',
height: 100,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 6,
elevation: 4,
},
noLastWatchedText: {
fontSize: 16,
color: '#7F8C8D',
textAlign: 'center',
},
recommendedContainer: {
flex: 1,
},
recommendedTitle: {
fontSize: 22,
fontWeight: 'bold',
color: '#2C3E50',
marginBottom: 16,
},
categoryContainer: {
marginBottom: 24,
},
categoryTitle: {
fontSize: 18,
fontWeight: '600',
color: '#34495E',
marginBottom: 12,
paddingLeft: 4,
},
videosGrid: {
flexDirection: 'row',
flexWrap: 'wrap',
justifyContent: 'flex-start',
},
videoBox: {
marginBottom: 16,
borderRadius: 12,
backgroundColor: '#FFFFFF',
overflow: 'hidden',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 6,
elevation: 4,
},
videoThumbnail: {
width: '100%',
height: 90,
borderTopLeftRadius: 12,
borderTopRightRadius: 12,
},
videoTitle: {
fontSize: 12,
fontWeight: '500',
color: '#34495E',
padding: 8,
height: 50,
},
loadingText: {
fontSize: 16,
color: '#7F8C8D',
textAlign: 'center',
marginTop: 20,
},
noLessonsText: {
fontSize: 16,
color: '#7F8C8D',
textAlign: 'center',
marginTop: 20,
},
});

export default LessonRedirectionStuttering;