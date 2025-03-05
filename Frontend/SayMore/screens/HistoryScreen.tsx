import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { WatchedVideo } from '../types/types';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';

interface HistoryScreenProps {}

const HistoryScreen: React.FC<HistoryScreenProps> = () => {
    const [watchedVideos, setWatchedVideos] = useState<WatchedVideo[]>([]);

    const firebaseConfig = {
      apiKey: "AIzaSyBkyYR26RgIkSLpVnQYPBCRd05SdsyZ26M",
      authDomain: "saymore-340e9.firebaseapp.com",
      projectId: "saymore-340e9",
      storageBucket: "saymore-340e9.appspot.com",
      messagingSenderId: "290999401549",
      appId: "1:290999401549:web:8ad3bc50100a9c4fd2e903",
    };

    useEffect(() => {
        const fetchWatchedVideos = async () => {
            try {
                let app;
                if (!getApps().length) {
                    app = initializeApp(firebaseConfig);
                } else {
                    app = getApp();
                }
                const db = getFirestore(app);
                const user = auth().currentUser;

                if (!user) {
                    console.log('No user signed in. Cannot fetch history.');
                    return;
                }

                const userId = user.uid;
                console.log(`Fetching history for User ID: ${userId}`);

                const watchedVideosCollectionRef = collection(db, 'watched_videos', userId, 'user_watched_videos');
                const querySnapshot = await getDocs(watchedVideosCollectionRef);
                const watchedVideosList: WatchedVideo[] = querySnapshot.docs.map(doc => doc.data() as WatchedVideo);
                setWatchedVideos(watchedVideosList);
            } catch (error) {
                console.error('Error fetching watched videos:', error);
            }
        };

        fetchWatchedVideos();
    }, []);

    const renderItem = ({ item }: { item: WatchedVideo }) => (
        <View style={styles.historyItem}>
            <Text style={styles.historyTitle}>{item.title}</Text>
            <Text style={styles.historyTimestamp}>Watched on: {item.timestamp}</Text>
            <Text style={styles.historyLesson}>Lesson: {item.lessonTitle}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Watched Video History</Text>
            <FlatList
                data={watchedVideos}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    historyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyTimestamp: {
        fontSize: 12,
        color: '#666',
    },
    historyLesson: {
        fontSize: 14,
        color: '#333'
    }
});

export default HistoryScreen;