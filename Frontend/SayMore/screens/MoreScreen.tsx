import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const NewScreens = [
  { title: 'Activity', icon: require('../assets/activity2.png') },
  { title: 'Lesson', icon: require('../assets/lesson.png') },
  { title: 'Quizzes and Challenges', icon: require('../assets/quiz.png') },
  { title: 'Progress', icon: require('../assets/progress.png') },
  { title: 'Points', icon: require('../assets/points.png') },
  { title: 'Speech Therapy', icon: require('../assets/speech.png') },
  { title: 'Watched Lessons', icon: require('../assets/lesson.png') },
];

interface MoreScreenProps {
  navigation: NavigationProp<any>;
}

const MoreScreen: React.FC<MoreScreenProps> = ({ navigation }) => {
  const theme = useTheme();

  const handlePress = (title: string) => {
    if (title === 'Lessons') {
      navigation.navigate('Lessons');
    } else if (title === 'Quizzes and Challenges') {
      navigation.navigate('QuizzesNavScreen'); //
    } else if (title === 'Speech Therapy') {
      navigation.navigate('SpeechTherapyScreen');
    }
    if (title === 'Watched Lessons') {
      navigation.navigate('History');
    }
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={
          theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
        }
        style={styles.container}>
        <View style={styles.gridContainer}>
          {NewScreens.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.lessonButton,
                theme === 'dark'
                  ? styles.darkLessonButton
                  : styles.lightLessonButton,
              ]}
              onPress={() => handlePress(item.title)}>
              <View style={styles.imageContainer}>
                {item.icon ? (
                  <Image source={item.icon} style={styles.lessonIcon} />
                ) : null}
              </View>
              <Text
                style={
                  theme === 'dark'
                    ? styles.darkLessonText
                    : styles.lightLessonText
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
  Container: { flex: 1, padding: 20 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lessonButton: {
    width: '45%',
    height: 190,
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginHorizontal: 10,
  },
  darkLessonButton: { backgroundColor: '#4a4a4a' },
  lightLessonButton: { backgroundColor: '#E6F7FF' },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  lessonIcon: { width: 100, height: 100, borderRadius: 30 },
  lessonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
  lightLessonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
  darkLessonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default MoreScreen;
