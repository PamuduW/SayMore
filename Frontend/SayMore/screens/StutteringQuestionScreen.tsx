import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';
import LinearGradient from 'react-native-linear-gradient';

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
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const setMappings: { [key: string]: string } = {
    'relaxation techniques': 'set1',
    'speech techniques': 'set2',
    pronunciation: 'set3',
  };

  // Fetch & shuffle questions
  const fetchQuestions = async (setName: string) => {
    setLoading(true);
    try {
      const doc = await firestore()
        .collection('Questions')
        .doc('Stuttering_Ques')
        .get();
      if (!doc.exists) {
        console.error('Firestore document does not exist.');
        return;
      }

      const data = doc.data();
      if (!data || !data[setMappings[setName]]) {
        console.error(`No questions found for set: ${setName}`);
        return;
      }

      // Extract & shuffle questions
      let extractedQuestions = Object.keys(data[setMappings[setName]])
        .filter(key => key.startsWith('Q'))
        .map(key => ({
          id: key,
          ...data[setMappings[setName]][key],
        }));

      extractedQuestions = extractedQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 7); // Pick only 7 questions

      setQuestions(extractedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedSet(setName);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCorrectAnswer = (question: Question): string => {
    return question.Answers[`A${question.Correct}`];
  };

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    setShowConfirm(true); // Show Confirm button
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer !== null) {
      const correctAnswer = getCorrectAnswer(questions[currentQuestionIndex]);
      const correct = selectedAnswer === correctAnswer;

      setIsCorrect(correct);
      setShowConfirm(false); // Hide Confirm button

      if (correct) {
        setScore(score + 10);
        setTimeout(() => handleNextQuestion(), 500); // Auto move to next question after 0.5s if correct
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowConfirm(false);
    } else {
      navigation.navigate('PointsScreen', {
        points: score,
        totalPoints: questions.length * 10,
      });
    }
  };

  if (!selectedSet) {
    return (
      <LinearGradient colors={['#1E3C72', '#2A5298']} style={styles.container}>
        <Text style={styles.header}>Select a Quiz Topic</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.elevatedButton}
            onPress={() => fetchQuestions('relaxation techniques')}>
            <Text style={styles.buttonText}>Relaxation Techniques</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.elevatedButton}
            onPress={() => fetchQuestions('speech techniques')}>
            <Text style={styles.buttonText}>Speech Techniques</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.elevatedButton}
            onPress={() => fetchQuestions('pronunciation')}>
            <Text style={styles.buttonText}>Pronunciation</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1E3C72', '#2A5298']} style={styles.container}>
      <Text style={styles.header}>{selectedSet} Quiz</Text>
      <Text style={styles.progressText}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      <ProgressBar
        progress={(currentQuestionIndex + 1) / questions.length}
        width={330}
        height={12}
        color="#4CAF50"
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
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelection(option)}
              disabled={isCorrect !== null}
              style={[
                styles.elevatedButton,
                selectedAnswer === option
                  ? styles.selectedOption
                  : styles.defaultOption,
                isCorrect !== null &&
                  option === correctAnswer &&
                  styles.correctOption, // Always highlight correct answer in green
                isCorrect !== null &&
                  option === selectedAnswer &&
                  !isCorrect &&
                  styles.incorrectOption, // Highlight wrong selection in red
              ]}>
              <Text style={styles.buttonText}>{option}</Text>
            </TouchableOpacity>
          );
        }
      )}

      {showConfirm && (
        <TouchableOpacity
          onPress={handleConfirmAnswer}
          style={styles.confirmButton}>
          <Text style={styles.buttonText}>Confirm Answer</Text>
        </TouchableOpacity>
      )}

      {isCorrect === false && (
        <TouchableOpacity
          onPress={handleNextQuestion}
          style={styles.nextButton}>
          <Text style={styles.buttonText}>Next Question</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  progressText: { fontSize: 16, color: '#fff', marginBottom: 10 },
  question: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBar: { marginBottom: 20, borderRadius: 10 },
  image: { width: 200, height: 120, resizeMode: 'contain', marginBottom: 20 },

  elevatedButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '90%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3C72',
  },
  correctOption: { backgroundColor: '#27ae60' },
  incorrectOption: { backgroundColor: '#e74c3c' },
  selectedOption: { backgroundColor: '#f1c40f' },
  confirmButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 12,
    width: '90%',
    marginTop: 15,
  },
  nextButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    width: '90%',
    marginTop: 15,
  },
});

export default StutteringQuestionScreen;
