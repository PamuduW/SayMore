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
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface Props {
  userRecords: { score: number }[];
  totalWatchedLessons: number;
  totalWatchedVideos: number;
}

const ActivityScreen: React.FC<Props> = ({
  userRecords,
  totalWatchedLessons,
  totalWatchedVideos,
}) => {
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
        message: `Check out my activity! I've watched ${totalWatchedVideos} videos, ${totalWatchedLessons} lessons, taken ${stats.stutteringQuizzes} Stuttering quizzes and ${stats.publicSpeakingQuizzes} Public Speaking quizzes! 🎯 Keep up the great work! 🚀`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNavigateToHistory = () => {
    (navigation as any).navigate('HistoryScreen');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={
            theme === 'dark' ? styles.darkBackButton : styles.lightBackButton
          }
          onPress={handleBackPress}>
          <Text
            style={
              theme === 'dark'
                ? styles.darkBackButtonText
                : styles.lightBackButtonText
            }>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={theme === 'dark' ? styles.darkTitle : styles.lightTitle}>
          My Activity
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/act.jpg')}
          style={styles.progressImage}
        />
      </View>

      <View style={styles.statsContainer}>
        {/* Video and Lesson Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[
              theme === 'dark' ? styles.darkStatCard : styles.lightStatCard,
              styles.statCard,
            ]}
            onPress={handleNavigateToHistory}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>🎬</Text>
            </View>
            <Text
              style={
                theme === 'dark' ? styles.darkStatTitle : styles.statTitle
              }>
              Videos
            </Text>
            <Text
              style={
                theme === 'dark' ? styles.darkStatValue : styles.statValue
              }>
              {totalWatchedVideos}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              theme === 'dark' ? styles.darkStatCard : styles.lightStatCard,
              styles.statCard,
            ]}
            onPress={handleNavigateToHistory}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>📚</Text>
            </View>
            <Text
              style={
                theme === 'dark' ? styles.darkStatTitle : styles.statTitle
              }>
              Lessons
            </Text>
            <Text
              style={
                theme === 'dark' ? styles.darkStatValue : styles.statValue
              }>
              {totalWatchedLessons}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quiz Stats */}
        <View style={styles.quizStatsContainer}>
          <Text
            style={
              theme === 'dark' ? styles.darkSectionTitle : styles.sectionTitle
            }>
            Quiz Performance
          </Text>

          <View
            style={
              theme === 'dark' ? styles.darkQuizCard : styles.lightQuizCard
            }>
            <View style={styles.quizRow}>
              <View style={styles.quizIconContainer}>
                <Text style={styles.quizIcon}>📊</Text>
              </View>
              <View style={styles.quizTextContainer}>
                <Text
                  style={
                    theme === 'dark' ? styles.darkQuizTitle : styles.quizTitle
                  }>
                  Total Quizzes
                </Text>
                <Text
                  style={
                    theme === 'dark' ? styles.darkQuizValue : styles.quizValue
                  }>
                  {stats.totalQuizzes}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={
              theme === 'dark' ? styles.darkQuizCard : styles.lightQuizCard
            }>
            <View style={styles.quizRow}>
              <View style={styles.quizIconContainer}>
                <Text style={styles.quizIcon}>🗣</Text>
              </View>
              <View style={styles.quizTextContainer}>
                <Text
                  style={
                    theme === 'dark' ? styles.darkQuizTitle : styles.quizTitle
                  }>
                  Stuttering Quizzes
                </Text>
                <Text
                  style={
                    theme === 'dark' ? styles.darkQuizValue : styles.quizValue
                  }>
                  {stats.stutteringQuizzes}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={
              theme === 'dark' ? styles.darkQuizCard : styles.lightQuizCard
            }>
            <View style={styles.quizRow}>
              <View style={styles.quizIconContainer}>
                <Text style={styles.quizIcon}>🎤</Text>
              </View>
              <View style={styles.quizTextContainer}>
                <Text
                  style={
                    theme === 'dark' ? styles.darkQuizTitle : styles.quizTitle
                  }>
                  Public Speaking Quizzes
                </Text>
                <Text
                  style={
                    theme === 'dark' ? styles.darkQuizValue : styles.quizValue
                  }>
                  {stats.publicSpeakingQuizzes}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Text
        style={
          theme === 'dark' ? styles.darkFooterText : styles.lightFooterText
        }>
        You're doing great! Keep up the effort and continue learning! 🌟
      </Text>

      <TouchableOpacity
        style={
          theme === 'dark' ? styles.darkShareButton : styles.lightShareButton
        }
        onPress={handleShare}>
        <Text style={styles.shareText}>➤ Share Your Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  lightContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  darkContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  lightTitle: {
    fontSize: 28,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  darkTitle: {
    fontSize: 28,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#E1F0FF',
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: cardWidth,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lightStatCard: {
    backgroundColor: '#FFFFFF',
  },
  darkStatCard: {
    backgroundColor: '#2C2C2C',
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  darkStatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BBB',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0070E0',
  },
  darkStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4DA3FF',
  },
  quizStatsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  darkSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFF',
  },
  lightQuizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  darkQuizCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  quizRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#E1F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizIcon: {
    fontSize: 20,
  },
  quizTextContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  darkQuizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DDD',
    marginBottom: 4,
  },
  quizValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0070E0',
  },
  darkQuizValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4DA3FF',
  },
  lightFooterText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    lineHeight: 22,
  },
  darkFooterText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EEE',
    lineHeight: 22,
  },
  lightShareButton: {
    backgroundColor: '#0070E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  darkShareButton: {
    backgroundColor: '#3D85C6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  lightBackButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkBackButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  lightBackButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    lineHeight: 28,
  },
  darkBackButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 28,
  },
  shareText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActivityScreen;
