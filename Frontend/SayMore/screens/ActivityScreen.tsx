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

interface UserRecord {
  score: number;
}

interface Props {
  userRecords: UserRecord[];
}



const ActivityScreen: React.FC<Props> = ({ userRecords }) => {
  const [stats, setStats] = useState({
    avgScore: 0,
    highestScore: 0,
    totalQuizzes: 0,
  });

  // Update stats based on user records
  useEffect(() => {
    if (userRecords && userRecords.length > 0) {
      const totalScore = userRecords.reduce(
        (acc, record) => acc + record.score,
        0
      );
      const highestScore = Math.max(...userRecords.map(record => record.score));
      setStats({
        avgScore: parseFloat((totalScore / userRecords.length).toFixed(2)),
        highestScore: highestScore,
        totalQuizzes: userRecords.length,
      });
    }
  }, [userRecords]);

  // Share function
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've been improving my quiz scores! My highest score is ${stats.highestScore} points! 🎯`,
      });
    } catch (error) {
      console.error(error);
    }
  };
const theme = useTheme();

  return (
    <ScrollView style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <Text style={theme === 'dark' ? styles.darkTitle: styles.lightTitle }>Activity</Text>

      {/* Progress Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/act.jpg')}
          style={styles.progressImage}
        />
      </View>

      <View style={theme === 'dark' ? styles.darkInfoBox : styles.lightInfoBox}>
        <Text style={styles.infoText}>
          Total Videos Watched: {stats.totalQuizzes}
        </Text>
      </View>
      <View style={theme === 'dark' ? styles.darkInfoBox : styles.lightInfoBox}>
        <Text style={styles.infoText}>
          Total Public Speaking Quizzes Taken: {stats.totalQuizzes}
        </Text>
      </View>
      <View style={theme === 'dark' ? styles.darkInfoBox : styles.lightInfoBox}>
        <Text style={styles.infoText}>
          Total Stuttering Quizzes Taken: {stats.totalQuizzes}
        </Text>
      </View>

      <Text style={theme === 'dark' ? styles.darkFooterText : styles.lightFooterText}>
        Your scores have been steadily improving! 🚀 Keep up the amazing work
        and let’s aim even higher! 💪🔥 You’re doing fantastic! 🌟
      </Text>

      <TouchableOpacity style={theme === 'dark' ? styles.darkShareButton : styles.lightShareButton} onPress={handleShare}>
        <Text style={styles.shareText}>➤ Share Your Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  lightContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },

  darkContainer: { flex: 1, padding: 20, backgroundColor: '#3A3A3A' },

  lightTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },
  darkTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#DFF6FF',
    borderRadius: 15,
    marginBottom: 20,
  },
  progressImage: {
    width: 300, // Adjust size as needed
    height: 200,
    resizeMode: 'contain',
  },

  lightInfoBox: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  darkInfoBox: {
    backgroundColor: '#2B2B2B',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  infoText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  lightFooterText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  darkFooterText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  lightShareButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  darkShareButton: {
    backgroundColor: '#2B2B2B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  shareText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ActivityScreen;
