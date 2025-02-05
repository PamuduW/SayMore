import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

export default function LessonsScreen() {
  const lessons = [
    { title: 'Activity ', icon: require('../assets/videoicon.png') },
    { title: 'Lessons', icon: require('../assets/videoicon.png') },
    { title: 'Quizzes and Challenges', icon: require('../assets/videoicon.png') },
    { title: 'Progress', icon: require('../assets/videoicon.png') },
    { title: 'Points', icon: require('../assets/videoicon.png') },
    { title: 'Leaderboard', icon: require('../assets/videoicon.png') },
    { title: 'Speech Therapy', icon: require('../assets/videoicon.png') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {lessons.map((lesson, index) => (
          <TouchableOpacity key={index} style={styles.lessonButton}>
            <Image source={lesson.icon} style={styles.lessonIcon} />
            <Text style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#003366',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lessonButton: {
    width: '48%',
    backgroundColor: '#E6F7FF',
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
  lessonIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  lessonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
});
