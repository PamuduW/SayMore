import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface Props {
  userRecords: { score: number }[];
  totalWatchedLessons: number;
}

const ActivityScreen: React.FC<Props> = ({ userRecords, totalWatchedLessons }) => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    stutteringQuizzes: 0,
    publicSpeakingQuizzes: 0,
  });
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    const fetchUserQuizAttempts = async () => {
      try {
        const user = auth().currentUser;
        if (!user) return;

        const userDoc = await firestore()
          .collection('User_Accounts')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          const quizAttempts = userData?.quizAttempts || [];

          const stutteringCount = quizAttempts.filter(
            (quiz: any) => quiz.quizType === 'Stuttering'
          ).length;
          const publicSpeakingCount = quizAttempts.filter(
            (quiz: any) => quiz.quizType === 'Public Speaking'
          ).length;

          setStats({
            stutteringQuizzes: stutteringCount,
            publicSpeakingQuizzes: publicSpeakingCount,
            totalQuizzes: quizAttempts.length,
          });
        }
      } catch (error) {
        console.error('Error fetching user quiz attempts:', error);
      }
    };

    fetchUserQuizAttempts();
  }, []);

  useEffect(() => {
    if (userRecords && userRecords.length > 0) {
      setStats(prevStats => ({
        ...prevStats,
        totalQuizzes: userRecords.length,
      }));
    }
  }, [userRecords]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my activity! I've taken ${stats.stutteringQuizzes} Stuttering quizzes and ${stats.publicSpeakingQuizzes} Public Speaking quizzes! 🎯 Keep up the great work! 🚀`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNavigateToHistory = () => {
    navigation.navigate('HistoryScreen');
  };

  return (
    <ScrollView
      style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={theme === 'dark' ? styles.darkBackButton : styles.lightBackButton}
          onPress={handleBackPress}>
          <Text style={theme === 'dark' ? styles.darkBackButtonText : styles.lightBackButtonText}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={theme === 'dark' ? styles.darkTitle : styles.lightTitle}>
          Activity
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('../assets/act.jpg')} style={styles.progressImage} />
      </View>

      <TouchableOpacity onPress={handleNavigateToHistory}>
        <View style={theme === 'dark' ? styles.darkInfoBox : styles.lightInfoBox}>
          <Text style={styles.infoText}>Watched Lessons {totalWatchedLessons}</Text>
        </View>
      </TouchableOpacity>

      <View style={theme === 'dark' ? styles.darkInfoBox : styles.lightInfoBox}>
        <Text style={styles.infoText}>Total Quizzes Taken: {stats.totalQuizzes}</Text>
      </View>

      <View style={theme === 'dark' ? styles.darkInfoBox : styles.lightInfoBox}>
        <Text style={styles.infoText}>Stuttering Quizzes Taken: {stats.stutteringQuizzes}</Text>
      </View>

      <View style={theme === 'dark' ? styles.darkInfoBox : styles.lightInfoBox}>
        <Text style={styles.infoText}>Public Speaking Quizzes Taken: {stats.publicSpeakingQuizzes}</Text>
      </View>

      <Text style={theme === 'dark' ? styles.darkFooterText : styles.lightFooterText}>
        You're doing great! Keep up the effort and continue learning! 🌟
      </Text>

      <TouchableOpacity
        style={theme === 'dark' ? styles.darkShareButton : styles.lightShareButton}
        onPress={handleShare}>
        <Text style={styles.shareText}>➤ Share Your Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  lightContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  darkContainer: { flex: 1, padding: 20, backgroundColor: '#3A3A3A' },
  headerContainer: { flexDirection: 'row', alignItems: 'center' },
  lightTitle: { fontSize: 28, flex: 1, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#000' },
  darkTitle: { fontSize: 28, flex: 1, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#fff' },
  imageContainer: { alignItems: 'center', padding: 10, backgroundColor: '#DFF6FF', borderRadius: 15, marginBottom: 20 },
  progressImage: { width: 300, height: 200, resizeMode: 'contain' },
  lightInfoBox: { backgroundColor: '#007AFF', padding: 20, borderRadius: 10, marginVertical: 10, alignItems: 'center' },
  darkInfoBox: { backgroundColor: '#2B2B2B', padding: 20, borderRadius: 10, marginVertical: 10, alignItems: 'center' },
  infoText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  lightFooterText: { textAlign: 'center', marginTop: 10, fontSize: 16, marginBottom: 20, fontWeight: 'bold', color: '#000' },
  darkFooterText: { textAlign: 'center', marginTop: 10, fontSize: 16, marginBottom: 20, fontWeight: 'bold', color: '#fff' },
  lightShareButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  darkShareButton: { backgroundColor: '#2B2B2B', padding: 15, borderRadius: 10, alignItems: 'center' },
  lightBackButton: { width: 48, height: 48, backgroundColor: '#E6F7FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  darkBackButton: { width: 48, height: 48, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  lightBackButtonText: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50' },
  darkBackButtonText: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  shareText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ActivityScreen;
