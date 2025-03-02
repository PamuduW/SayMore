// src/screens/MoreScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';

const NewScreens = [
  { title: "Activity", icon: require("../assets/activity2.png") },
  { title: "Lessons", icon: require("../assets/lesson.png") }, // Changed title here
  { title: "Quizzes and Challenges", icon: require("../assets/quiz.png") },
  { title: "Progress", icon: require("../assets/progress.png") },
  { title: "Points", icon: require("../assets/points.png")},
  { title: "Leaderboard", icon: require("../assets/leaderboard.png")},
  { title: "Speech Therapy", icon:require("../assets/speech.png")},
];

interface MoreScreenProps {
  navigation: NavigationProp<any>;
}

const MoreScreen: React.FC<MoreScreenProps> = ({ navigation }) => {
  const theme = useTheme();

  const handlePress = (title: string) => {
    if (title === 'Lessons') { // Changed title here
      navigation.navigate('Lessons');
    }
  };

  return (
    <View
      style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
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
            {item.icon ? (
              <Image source={item.icon} style={styles.lessonIcon} />
            ) : null}
            <Text style={styles.lessonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  darkContainer: { flex: 1, backgroundColor: '#000000', padding: 20 },
  lightContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lessonButton: {
    width: '48%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  darkLessonButton: { backgroundColor: '#4a4a4a' },
  lightLessonButton: { backgroundColor: '#E6F7FF' },
  lessonIcon: { width: 50, height: 50, marginBottom: 10 },
  lessonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
});

export default MoreScreen;