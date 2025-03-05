import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { Lesson } from '../types/types'; // Import the Lesson type

interface LessonsScreenProps {}

/**
 * LessonsScreen component.
 * Displays a list of lessons with educational videos, tips, and techniques.
 *
 * @returns {JSX.Element} The rendered LessonsScreen component.
 */
const LessonsScreen: React.FC<LessonsScreenProps> = () => {
  const navigation = useNavigation(); // Use the navigation hook

  const lessons: Lesson[] = [
    { title: 'Speech Exercises', icon: require('../assets/speech-exercises.png'), documentId: 'speech_exercises' },
    { title: 'Understanding Stuttering', icon: require('../assets/understanding-stuttering.png'), documentId: 'understanding_stuttering' },
    { title: 'Building Confidence', icon: require('../assets/building-confidence.png'), documentId: 'building_confidence' },
    { title: 'Communication Tips', icon: require('../assets/communication-tips.png'), documentId: 'communication_tips' },
    { title: 'Overcoming Stuttering', icon: require('../assets/overcoming-stuttering.png'), documentId: 'overcoming_stuttering' },
    { title: 'Managing Stage Fright', icon: require('../assets/managing-stage-fright.png'), documentId: 'stage_fright' },
    { title: 'How to get a deeper voice', icon: require('../assets/deeper-voice.png'), documentId: 'deeper_voice' },
    { title: 'Clarity in Speech', icon: require('../assets/clarity.png'), documentId: 'clarity' },
    { title: 'Perfecting Your Pitch', icon: require('../assets/pitch.png'), documentId: 'pitch' },
    { title: 'Mastering Speech Intensity', icon: require('../assets/intensity.png'), documentId: 'intensity' },
    { title: 'Speaking with Energy', icon: require('../assets/energy.png'), documentId: 'energy' },
  ];

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate('VideoList', { lesson });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Hi there,</Text>
        <Text style={styles.subText}>
          Unlock your potential as a confident speaker. Explore our educational
          videos, tips, and techniques designed to help you overcome stuttering,
          build confidence, and communicate with clarity to become the speaker
          you’ve always wanted to be!
        </Text>
        <View style={styles.gridContainer}>
          {lessons.map((lesson, index) => (
            <TouchableOpacity
              key={index}
              style={styles.lessonButton}
              onPress={() => handleLessonPress(lesson)}
            >
              <Image source={lesson.icon} style={styles.lessonIcon} />
              <Text style={styles.lessonText}>{lesson.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 20 },
  container: { flex: 1, backgroundColor: '#F0F8FF', padding: 20 },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  subText: { fontSize: 16, color: '#003366', marginBottom: 20 },
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
  lessonIcon: { width: 40, height: 40, marginBottom: 10 },
  lessonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
});

export default LessonsScreen;
