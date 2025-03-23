import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lesson } from '../types/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../components/ThemeContext';

interface LessonsScreenProps {}

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;

const LessonsScreen: React.FC<LessonsScreenProps> = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState<string | null>(null);

  const theme = useTheme();
  useEffect(() => {
    const fetchFirstName = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore()
            .collection('User_Accounts')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            if (data && data.fname) {
              setFirstName(data.fname);
            } else {
              setFirstName('there');
            }
          } else {
            setFirstName('there');
          }
        } catch (error) {
          //console.error('Error fetching first name:', error);
          setFirstName('there');
        }
      } else {
        setFirstName('there');
      }
    };

    fetchFirstName();
  }, []);

  const lessons: Lesson[] = [
    {
      title: 'Speech Exercises',
      icon: require('../assets/speech-exercises.png'),
      documentId: 'speech_exercises',
    },
    {
      title: 'Understanding Stuttering',
      icon: require('../assets/understanding-stuttering.png'),
      documentId: 'understanding_stuttering',
    },
    {
      title: 'Building Confidence',
      icon: require('../assets/building-confidence.png'),
      documentId: 'building_confidence',
    },
    {
      title: 'Communication Tips',
      icon: require('../assets/communication-tips.png'),
      documentId: 'communication_tips',
    },
    {
      title: 'Overcoming Stuttering',
      icon: require('../assets/overcoming-stuttering.png'),
      documentId: 'overcoming_stuttering',
    },
    {
      title: 'Managing Stage Fright',
      icon: require('../assets/managing-stage-fright.png'),
      documentId: 'stage_fright',
    },
    {
      title: 'How to get a deeper voice',
      icon: require('../assets/deeper-voice.png'),
      documentId: 'deeper_voice',
    },
    {
      title: 'Clarity in Speech',
      icon: require('../assets/clarity.png'),
      documentId: 'clarity',
    },
    {
      title: 'Perfecting Your Pitch',
      icon: require('../assets/pitch.png'),
      documentId: 'pitch',
    },
    {
      title: 'Speaking with Energy',
      icon: require('../assets/energy.png'),
      documentId: 'energy',
    },
  ];

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate('VideoList', { lesson });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View
          style={
            theme === 'dark' ? styles.darkContainer : styles.lightContainer
          }>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={
                theme === 'dark'
                  ? styles.darkBackButton
                  : styles.lightBackButton
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
            <View style={styles.headerTextContainer}>
              <Text
                style={
                  theme === 'dark'
                    ? styles.darkHeaderText
                    : styles.lightHeaderText
                }>
                Hi {firstName},
              </Text>
            </View>
          </View>
          <Text
            style={theme === 'dark' ? styles.darkSubText : styles.lightSubText}>
            Unlock your potential as a confident speaker. Explore our
            educational videos, tips, and techniques designed to help you
            overcome stuttering, build confidence, and communicate with clarity
            to become the speaker you've always wanted to be!
          </Text>
          <View style={styles.gridContainer}>
            {lessons.map((lesson, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  theme === 'dark'
                    ? styles.darkLessonButton
                    : styles.lightLessonButton,
                  { width: itemWidth },
                ]}
                onPress={() => handleLessonPress(lesson)}>
                <View style={styles.imageContainer}>
                  <Image
                    source={lesson.icon}
                    style={styles.lessonIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={
                    theme === 'dark'
                      ? styles.darkLessonText
                      : styles.lightLessonText
                  }>
                  {lesson.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },

  lightContainer: {
    flex: 1,
    backgroundColor: '#577BC1',
    padding: 20,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#2B2B2B',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },

  lightHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  darkHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  lightBackButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E6F7FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  darkBackButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  lightBackButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 2, // Fine-tune vertical centering
    lineHeight: 32, // Control line height to center text
  },
  darkBackButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 2,
    lineHeight: 32,
  },

  lightSubText: {
    fontSize: 17,
    color: 'black',
    marginBottom: 24,
    lineHeight: 24,
  },
  darkSubText: {
    fontSize: 17,
    color: 'white',
    marginBottom: 24,
    lineHeight: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  lightLessonButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  darkLessonButton: {
    backgroundColor: '#3C3C3C',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  imageContainer: {
    height: 100,
    width: '100%',
    marginBottom: 10,
    overflow: 'hidden',
  },
  lessonIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  lessonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  lightLessonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  darkLessonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default LessonsScreen;
