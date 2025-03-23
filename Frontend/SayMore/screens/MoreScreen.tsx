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
  { title: 'Test History', icon: require('../assets/lesson.png') },
];

interface MoreScreenProps {
  navigation: NavigationProp<any>;
}

const MoreScreen: React.FC<MoreScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 60) / 2;

  const handlePress = (title: string) => {
    if (title === 'Activity') {
      navigation.navigate('ActivityScreen');
    } else if (title === 'Lessons') {
      navigation.navigate('Lessons');
    } else if (title === 'Quizzes & Challenges') {
      navigation.navigate('QuizzesNavScreen');
    } else if (title === 'Speech Therapy') {
      navigation.navigate('SpeechTherapyScreen');
    } else if (title === 'Watched Lessons') {
      navigation.navigate('History');
    } else if (title === 'Points') {
      navigation.navigate('PointsCategoryScreen');
    } else if (title === 'Progress') {
      navigation.navigate('ProgressCategoryScreen');
    } else if (title === 'Test History') {
      navigation.navigate('TestHistory');

    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={
          theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
        }
        style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Explore More</Text>
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

              <Text
                style={
                  theme === 'dark' ? styles.darkCardText : styles.lightCardText
                }>
                {item.title}
              </Text>
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
  titleContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  title: {
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#3B3B3B',
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
