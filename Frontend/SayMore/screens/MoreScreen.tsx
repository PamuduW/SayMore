import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const NewScreens = [
  { title: 'Activity', icon: require('../assets/activity2.png') },
  { title: 'Lessons', icon: require('../assets/lesson.png') },
  { title: 'Quizzes & Challenges', icon: require('../assets/quiz.png') },
  { title: 'Progress', icon: require('../assets/progress.png') },
  { title: 'Points', icon: require('../assets/points.png') },
  { title: 'Speech Therapy', icon: require('../assets/speech.png') },
  { title: 'Watched Lessons', icon: require('../assets/lesson.png') },
  { title: 'Test History', icon: require('../assets/refresh.png') },
];

interface MoreScreenProps {
  navigation: NavigationProp<any>;
}

const screenMap: Record<string, string> = {
  'Activity': 'ActivityScreen',
  'Lessons': 'Lessons',
  'Quizzes & Challenges': 'QuizzesNavScreen',
  'Speech Therapy': 'SpeechTherapyScreen',
  'Watched Lessons': 'History',
  'Points': 'PointsCategoryScreen',
  'Progress': 'ProgressCategoryScreen',
  'Test History': 'TestHistory',
};

const MoreScreen: React.FC<MoreScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 60) / 2;

  const handlePress = (title: string) => {
    const screenName = screenMap[title];
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={theme === 'dark' ? styles.darkBackground : styles.lightBackground}>
      <LinearGradient
        colors={theme === 'dark' ? ['#121212', '#1E1E1E'] : ['#577BC1', '#577BC1']}
        style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={theme === 'dark' ? styles.darkTitle : styles.lightTitle}>Explore More</Text>
        </View>
        <View style={styles.gridContainer}>
          {NewScreens.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              style={[
                styles.card,
                { width: cardWidth },
                theme === 'dark' ? styles.darkCard : styles.lightCard,
              ]}
              onPress={() => handlePress(item.title)}>
              <Image source={item.icon} style={styles.iconElevated} />
              <Text style={theme === 'dark' ? styles.darkCardText : styles.lightCardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  lightTitle: {
    fontSize: 24,
    color: '#2A2D57',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  darkTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 25,
    paddingVertical: 22,
    paddingHorizontal: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  lightCard: {
    backgroundColor: '#F9FAFC',
  },
  darkCard: {
    backgroundColor: '#2A2A2A',
  },
  iconElevated: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 15,
  },
  lightCardText: {
    fontSize: 16,
    color: '#2A2D57',
    fontWeight: '600',
    textAlign: 'center',
  },
  darkCardText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MoreScreen;