import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
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
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <TouchableOpacity
            onPress={handleBackPress}
            style={[
              styles.backButton,
              theme === 'dark' ? styles.backButtonDark : styles.backButtonLight,
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
                  style={[styles.optionText, { color: getOptionTextColor() }]}>
                  {topic.replace(/\b\w/g, c => c.toUpperCase())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {currentQuestionIndex === 0 && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={[
              styles.backButton,
              theme === 'dark' ? styles.backButtonDark : styles.backButtonLight,
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
                  style={[styles.optionText, { color: getOptionTextColor() }]}>
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
                isLastQuestion ? styles.finishButtonText : styles.nextButtonText
              }>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  progressText: { fontSize: 16, marginBottom: 10, color: '#FFFFFF' },
  question: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  progressBar: { marginBottom: 20, borderRadius: 10 },
  optionButton: {
    backgroundColor: '#d6eaf8',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginBottom: 12,
  },
  optionButtonDark: {
    backgroundColor: '#3A3A3A',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginBottom: 12,
  },
  optionText: { textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  correctOption: { backgroundColor: '#27ae60' },
  incorrectOption: { backgroundColor: '#e74c3c' },
  selectedOption: { backgroundColor: '#4c87c7' },
  confirmButton: {
    backgroundColor: '#289e1b',
    padding: 13,
    borderRadius: 10,
    marginVertical: 15,
    width: '90%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#3498db',
    padding: 13,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#1abc9c',
    padding: 13,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: { alignItems: 'center' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  backButtonLight: { backgroundColor: '#E6F7FF' },
  backButtonDark: { backgroundColor: '#FFF' },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    paddingBottom: 2,
    lineHeight: 32,
  },
  backButtonTextDark: { color: '#000' },
});

export default StutteringQuestionScreen;
