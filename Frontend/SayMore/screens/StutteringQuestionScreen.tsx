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

      let extractedQuestions = Object.keys(data[setMappings[setName]]).filter(key => key.startsWith('Q')).map(key => {
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
        const userDocRef = firestore().collection('User_Accounts').doc(user.uid);
        const userDoc = await userDocRef.get();
        let attemptCount = 1;

        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData?.quizAttempts) {
            // Count previous attempts of Stuttering quiz
            const stutteringAttempts = userData.quizAttempts.filter(
              (attempt: any) => attempt.quizType === "Stuttering"
            );
            attemptCount = stutteringAttempts.length + 1; // Increment
          }
        }

        const attemptData = {
          quizType: "Stuttering",
          set: selectedSet,
          score: score,
          totalPoints: questions.length * 10,
          timestamp: new Date().toISOString(),
          attemptCount: attemptCount, // Store attempt number
        };

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
            style={[styles.backButton, theme === 'dark' ? styles.backButtonDark : styles.backButtonLight]}>
            <Text
              style={[styles.backButtonText, theme === 'dark' && styles.backButtonTextDark]}>
              ←
            </Text>
          </TouchableOpacity>
          <Text style={styles.header}>Select a Quiz Topic</Text>
          <View style={styles.buttonContainer}>
            {['relaxation techniques', 'speech techniques', 'pronunciation'].map((topic, idx) => (
              <TouchableOpacity
                key={idx}
                style={theme === 'dark' ? styles.optionButtonDark : styles.optionButton}
                onPress={() => fetchQuestions(topic)}>
                <Text style={[styles.optionText, { color: getOptionTextColor() }]}>
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
            style={[styles.backButton, theme === 'dark' ? styles.backButtonDark : styles.backButtonLight]}>
            <Text style={[styles.backButtonText, theme === 'dark' && styles.backButtonTextDark]}>←</Text>
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

        {Object.values(questions[currentQuestionIndex].Answers).map((option, index) => {
          const correctAnswer = getCorrectAnswer(questions[currentQuestionIndex]);
          const isSelected = selectedAnswer === option;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelection(option)}
              disabled={isCorrect !== null}
              style={[
                theme === 'dark' ? styles.optionButtonDark : styles.optionButton,
                isSelected ? styles.selectedOption : {},
                isCorrect !== null && option === correctAnswer && styles.correctOption,
                isCorrect !== null && option !== correctAnswer && styles.incorrectOption,
              ]}>
              <Text
                style={[styles.optionText, { color: getOptionTextColor() }]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}

        {showConfirm && (
          <TouchableOpacity
            onPress={handleConfirmAnswer}
            style={[styles.confirmButton, theme === 'dark' ? styles.confirmButtonDark : styles.confirmButtonLight]}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        )}

        {isCorrect !== null && (
          <TouchableOpacity
            onPress={handleNextQuestion}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 18,
    color: '#fff',
  },
  progressBar: {
    marginVertical: 20,
  },
  question: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
  },
  optionButtonDark: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  selectedOption: {
    backgroundColor: '#289e1b',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#F44336',
  },
  confirmButton: {
    backgroundColor: '#008CBA',
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#289e1b',
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 20,
  },
  backButtonDark: {
    backgroundColor: '#333',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  backButtonTextDark: {
    color: '#1E3C72',
  },
});

export default StutteringQuestionScreen;
