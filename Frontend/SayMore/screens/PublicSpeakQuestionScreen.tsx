import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
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
  Question: string;
  Answers: AnswerOptions;
  Correct: number;
}

/**
 * PublicSpeakQuestionScreen component that displays a public speaking quiz.
 * @param {object} navigation - The navigation object for navigating between screens.
 * @param {object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered component.
 */
const PublicSpeakQuestionScreen: React.FC = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { difficulty } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [isConfirmButtonVisible, setIsConfirmButtonVisible] = useState(false);
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedQuestions, setCompletedQuestions] = useState(0);

  /**
   * Fetches questions from Firestore based on the selected difficulty.
   */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const doc = await firestore()
          .collection('Questions')
          .doc('PS_Questions')
          .get();

        if (!doc.exists) {
          console.error('Firestore document does not exist.');
          return;
        }

        const data = doc.data();
        if (!data || !data.Set) {
          console.error('No valid question sets found!');
          return;
        }

        const difficultyMap = {
          Easy: 'Set',
          Intermediate: 'Set_2',
          Hard: 'Set_3',
        };

        const selectedSetName = difficultyMap[difficulty];

        if (!selectedSetName || !data[selectedSetName]) {
          console.error(
            'No questions found for the selected difficulty:',
            difficulty
          );
          return;
        }

        const extractedQuestions = Object.keys(data[selectedSetName])
          .filter(key => key.startsWith('Q'))
          .slice(0, 10)
          .map(key => ({
            id: key,
            ...data[selectedSetName][key],
          }));

        setQuestions(extractedQuestions);
      } catch (error) {
        console.error('Error fetching questions: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [difficulty]);

  /**
   * Shuffles the answer options for the current question.
   */
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionData = questions[currentQuestionIndex];
      const shuffledAnswers = Object.entries(currentQuestionData.Answers)
        .map(([key, value]) => ({ key, value, random: Math.random() }))
        .sort((a, b) => a.random - b.random)
        .map(obj => obj.value);

      const correctAnswerIndex = shuffledAnswers.indexOf(
        currentQuestionData.Answers[`A${currentQuestionData.Correct}`]
      );

      setShuffledOptions(shuffledAnswers);
      setCorrectIndex(correctAnswerIndex);
    }
  }, [currentQuestionIndex, questions]);

  /**
   * Handles the selection of an answer.
   * @param {number} index - The index of the selected answer.
   */
  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setIsConfirmButtonVisible(true);
  };

  /**
   * Confirms the selected answer and updates the score.
   */
  const handleConfirm = () => {
    if (selectedAnswer !== null) {
      const correct = selectedAnswer === correctIndex;
      setIsCorrect(correct);
      if (correct) setScore(score + 10);
      setIsConfirmButtonVisible(false);
      setIsNextButtonVisible(true);
      setCompletedQuestions(prev => prev + 1);
    }
  };

  /**
   * Saves the quiz attempt to Firestore.
   */
  const saveQuizAttempt = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const attemptData = {
          quizType: 'Public Speaking',
          difficulty: difficulty,
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

        console.log('✅ Public Speaking quiz attempt saved:', attemptData);
      }
    } catch (error) {
      console.error('🔥 Error saving quiz attempt:', error);
    }
  };

  /**
   * Handles the navigation to the next question.
   */
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setIsNextButtonVisible(false);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  /**
   * Handles the completion of the quiz.
   */
  const handleFinish = async () => {
    await saveQuizAttempt();
    const totalPoints = questions.length * 10;
    navigation.navigate('PointsScreen', { points: score, totalPoints });
  };

  /**
   * Returns the text color for the answer options based on the theme.
   * @returns {string} The text color.
   */
  const getOptionTextColor = () => (theme === 'dark' ? '#FFFFFF' : '#1E3C72');

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  const backgroundImage = require('../assets/qu.jpg');

  if (loading) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (questions.length === 0) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.loadingText}>
            No questions available for {difficulty}.
          </Text>
        </View>
      </ImageBackground>
    );
  }

  const question = questions[currentQuestionIndex];

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

          <Text style={styles.header}>Public Speaking Quiz</Text>
          <Text style={styles.difficultyText}>{difficulty}</Text>
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
          <Text style={styles.question}>{question.Question}</Text>

          {shuffledOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswer(index)}
              disabled={isCorrect !== null}
              style={[
                theme === 'dark'
                  ? styles.optionButtonDark
                  : styles.optionButton,
                selectedAnswer === index ? styles.selectedOption : {},
                isCorrect !== null &&
                  index === correctIndex &&
                  styles.correctOption,
                isCorrect !== null &&
                  index === selectedAnswer &&
                  !isCorrect &&
                  styles.incorrectOption,
              ]}>
              <Text
                style={[styles.optionText, { color: getOptionTextColor() }]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          {isConfirmButtonVisible && (
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Answer</Text>
            </TouchableOpacity>
          )}

          {isNextButtonVisible && !isLastQuestion && (
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next Question</Text>
            </TouchableOpacity>
          )}

          {isNextButtonVisible && isLastQuestion && (
            <TouchableOpacity
              onPress={handleFinish}
              style={styles.finishButton}>
              <Text style={styles.finishButtonText}>Finish Quiz</Text>
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
    paddingTop: 60,
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
    marginBottom: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 60,
  },
  difficultyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#FFFFFF',
    textAlign: 'center',
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
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomPadding: {
    height: 40,
  },
});

export default PublicSpeakQuestionScreen;
