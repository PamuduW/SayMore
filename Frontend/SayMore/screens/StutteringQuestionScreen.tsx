import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ProgressBar from 'react-native-progress/Bar';
import { useTheme } from '../components/ThemeContext';

interface AnswerOptions {
  A1: string;
  A2: string;
  A3: string;
  A4: string;
}

interface Question {
  id: string;
  Question: string;
  Answers: AnswerOptions;
  Correct: number;
}

const StutteringQuestionScreen: React.FC = ({ navigation }: any) => {
  const theme = useTheme();
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);

  const setMappings: { [key: string]: string } = {
    'relaxation techniques': 'set1',
    'speech techniques': 'set2',
    pronunciation: 'set3',
  };

  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const fetchQuestions = async (setName: string) => {
    try {
      const doc = await firestore()
        .collection('Questions')
        .doc('Stuttering_Ques')
        .get();
      if (!doc.exists) return;

      const data = doc.data();
      if (!data || !data[setMappings[setName]]) return;

      let extractedQuestions = Object.keys(data[setMappings[setName]])
        .filter(key => key.startsWith('Q'))
        .map(key => {
          const questionData = data[setMappings[setName]][key];

          const answersArray = Object.entries(questionData.Answers).map(
            ([ansKey, value]) => ({
              key: ansKey,
              value,
            })
          );

          const shuffledAnswers = shuffleArray(answersArray);

          const originalCorrectKey = `A${questionData.Correct}`;
          const newCorrectIndex =
            shuffledAnswers.findIndex(a => a.key === originalCorrectKey) + 1;

          return {
            id: key,
            Question: questionData.Question,
            Answers: shuffledAnswers.reduce((acc, curr, idx) => {
              acc[`A${idx + 1}`] = curr.value;
              return acc;
            }, {} as AnswerOptions),
            Correct: newCorrectIndex,
          };
        });

      extractedQuestions = shuffleArray(extractedQuestions).slice(0, 7);

      setQuestions(extractedQuestions);
      setCurrentQuestionIndex(0);
      setCompletedQuestions(0);
      setSelectedSet(setName);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const getCorrectAnswer = (question: Question): string => {
    return question.Answers[`A${question.Correct}`];
  };

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    setShowConfirm(true);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer !== null) {
      const correctAnswer = getCorrectAnswer(questions[currentQuestionIndex]);
      const correct = selectedAnswer === correctAnswer;

      setIsCorrect(correct);
      setShowConfirm(false);
      if (correct) setScore(score + 10);
      setCompletedQuestions(prev => prev + 1);
    }
  };

  const saveQuizAttempt = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const attemptData = {
          quizType: 'Stuttering',
          set: selectedSet,
          score: score,
          totalPoints: questions.length * 10,
          timestamp: new Date().toISOString(),
        };

        const userDocRef = firestore()
          .collection('User_Accounts')
          .doc(user.uid);
        await userDocRef.set(
          {
            quizAttempts: firestore.FieldValue.arrayUnion(attemptData),
          },
          { merge: true }
        );

        console.log('✅ Stuttering quiz attempt saved:', attemptData);
      }
    } catch (error) {
      console.error('🔥 Error saving stuttering quiz attempt:', error);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowConfirm(false);
    } else {
      await saveQuizAttempt();
      navigation.navigate('PointsScreen', {
        points: score,
        totalPoints: questions.length * 10,
      });
    }
  };

  const backgroundImage = require('../assets/qu.jpg');

  const getOptionTextColor = () => (theme === 'dark' ? '#FFFFFF' : '#1E3C72');

  const handleBackPress = () => {
    if (selectedSet) {
      setSelectedSet(null);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowConfirm(false);
      setScore(0);
      setCompletedQuestions(0);
    } else {
      navigation.goBack();
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (!selectedSet) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" />
            <TouchableOpacity
              onPress={handleBackPress}
              style={[
                styles.backButton,
                theme === 'dark'
                  ? styles.backButtonDark
                  : styles.backButtonLight,
              ]}>
              <Text
                style={[
                  styles.backButtonText,
                  theme === 'dark' && styles.backButtonTextDark,
                ]}>
                ←
              </Text>
            </TouchableOpacity>
            <Text style={styles.header}>Select a Quiz Topic</Text>
            <View style={styles.buttonContainer}>
              {[
                'relaxation techniques',
                'speech techniques',
                'pronunciation',
              ].map((topic, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={
                    theme === 'dark'
                      ? styles.optionButtonDark
                      : styles.optionButton
                  }
                  onPress={() => fetchQuestions(topic)}>
                  <Text
                    style={[
                      styles.optionText,
                      { color: getOptionTextColor() },
                    ]}>
                    {topic.replace(/\b\w/g, c => c.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <StatusBar barStyle="light-content" />
          {currentQuestionIndex === 0 && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={[
                styles.backButton,
                theme === 'dark'
                  ? styles.backButtonDark
                  : styles.backButtonLight,
              ]}>
              <Text
                style={[
                  styles.backButtonText,
                  theme === 'dark' && styles.backButtonTextDark,
                ]}>
                ←
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.header}>{selectedSet} Quiz</Text>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <ProgressBar
            progress={completedQuestions / questions.length}
            width={330}
            height={12}
            color="#289e1b"
            style={styles.progressBar}
          />
          <Text style={styles.question}>
            {questions[currentQuestionIndex].Question}
          </Text>

          {Object.values(questions[currentQuestionIndex].Answers).map(
            (option, index) => {
              const correctAnswer = getCorrectAnswer(
                questions[currentQuestionIndex]
              );
              const isSelected = selectedAnswer === option;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAnswerSelection(option)}
                  disabled={isCorrect !== null}
                  style={[
                    theme === 'dark'
                      ? styles.optionButtonDark
                      : styles.optionButton,
                    isSelected ? styles.selectedOption : {},
                    isCorrect !== null &&
                      option === correctAnswer &&
                      styles.correctOption,
                    isCorrect !== null &&
                      option === selectedAnswer &&
                      !isCorrect &&
                      styles.incorrectOption,
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      { color: getOptionTextColor() },
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}

          {showConfirm && (
            <TouchableOpacity
              onPress={handleConfirmAnswer}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Answer</Text>
            </TouchableOpacity>
          )}

          {isCorrect !== null && (
            <TouchableOpacity
              onPress={handleNextQuestion}
              style={isLastQuestion ? styles.finishButton : styles.nextButton}>
              <Text
                style={
                  isLastQuestion
                    ? styles.finishButtonText
                    : styles.nextButtonText
                }>
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Add some bottom padding for scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    paddingTop: 60, // Space for header and back button
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 60, // Add space for back button
  },
  progressText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#FFFFFF',
    lineHeight: 32,
    fontWeight: '600',
    paddingHorizontal: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBar: {
    marginBottom: 25,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  optionButton: {
    backgroundColor: 'rgba(214, 234, 248, 0.9)',
    padding: 18,
    borderRadius: 12,
    width: '90%',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  optionButtonDark: {
    backgroundColor: 'rgba(58, 58, 58, 0.9)',
    padding: 18,
    borderRadius: 12,
    width: '90%',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  correctOption: {
    backgroundColor: 'rgba(39, 174, 96, 0.9)',
    borderWidth: 2,
    borderColor: '#1e8449',
  },
  incorrectOption: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    borderWidth: 2,
    borderColor: '#b03a2e',
  },
  selectedOption: {
    backgroundColor: 'rgba(76, 135, 199, 0.9)',
    borderWidth: 2,
    borderColor: '#2874a6',
  },
  confirmButton: {
    backgroundColor: 'rgba(40, 158, 27, 0.9)',
    padding: 15,
    borderRadius: 12,
    marginVertical: 18,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#1e8814',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  nextButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    padding: 15,
    borderRadius: 12,
    marginTop: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2980b9',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  finishButton: {
    backgroundColor: 'rgba(26, 188, 156, 0.9)',
    padding: 15,
    borderRadius: 12,
    marginTop: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#16a085',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  backButtonLight: {
    backgroundColor: 'rgba(230, 247, 255, 0.9)',
  },
  backButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    paddingBottom: 3,
    lineHeight: 32,
  },
  backButtonTextDark: { color: '#000' },
  bottomPadding: {
    height: 40, // Add extra space at the bottom for scrolling
  },
});

export default StutteringQuestionScreen;
