import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';

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

const PublicSpeakQuestionScreen: React.FC = ({ navigation, route }: any) => {
  const { difficulty } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isConfirmButtonVisible, setIsConfirmButtonVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setIsConfirmButtonVisible(true);
  };

  const handleConfirm = () => {
    if (selectedAnswer !== null) {
      const correct = selectedAnswer === correctIndex;
      setIsCorrect(correct);
      if (correct) setScore(score + 10);
      setIsNextButtonDisabled(false);
      setIsConfirmButtonVisible(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setIsNextButtonDisabled(true);
    }
  };

  const handleFinish = () => {
    const totalPoints = questions.length * 10;
    navigation.navigate('PointsScreen', { points: score, totalPoints });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading questions...</Text>;
  }

  if (questions.length === 0) {
    return (
      <Text style={styles.loadingText}>
        No questions available for {difficulty}.
      </Text>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Public Speaking Quiz</Text>
      <Text style={styles.categoryText}>{difficulty}</Text>
      <Text style={styles.progressText}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      <ProgressBar
        progress={(currentQuestionIndex + 1) / questions.length}
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
            styles.optionButton,
            selectedAnswer === index
              ? styles.selectedOption
              : styles.defaultOption,
            isCorrect !== null &&
              index === correctIndex &&
              styles.correctOption,
            isCorrect !== null &&
              index === selectedAnswer &&
              !isCorrect &&
              styles.incorrectOption,
          ]}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      {isConfirmButtonVisible && (
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm Answer</Text>
        </TouchableOpacity>
      )}

      {isCorrect !== null && (
        <Text
          style={isCorrect ? styles.correctFeedback : styles.incorrectFeedback}>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </Text>
      )}

      {isCorrect !== null && currentQuestionIndex < questions.length - 1 && (
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextButton, isNextButtonDisabled && { opacity: 0.75 }]}
          disabled={isNextButtonDisabled}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}

      {currentQuestionIndex === questions.length - 1 && isCorrect !== null && (
        <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    justifyContent: 'center',
    borderRadius: 12,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  categoryText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a5276',
    fontStyle: 'italic',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2c3e50',
  },
  progressBar: {
    marginBottom: 20,
    borderRadius: 10,
  },
  question: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2980b9',
    paddingHorizontal: 20,
  },
  optionButton: {
    padding: 18,
    marginVertical: 10,
    width: '90%',
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#eaf2f8',
    borderColor: '#2980b9',
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedOption: {
    backgroundColor: '#a6dff7',
    borderColor: '#3498db',
  },
  defaultOption: {
    backgroundColor: '#d6eaf8',
    borderColor: '#2980b9',
  },
  correctOption: {
    backgroundColor: '#27ae60',
  },
  incorrectOption: {
    backgroundColor: '#e74c3c',
  },
  confirmButton: {
    backgroundColor: '#f39c12',
    padding: 13,
    borderRadius: 10,
    marginVertical: 15,
    width: '90%',
    shadowColor: '#f39c12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  correctFeedback: {
    fontSize: 20,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  incorrectFeedback: {
    fontSize: 20,
    color: '#e74c3c',
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
  loadingText: {
    fontSize: 20,
    color: '#34495e',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PublicSpeakQuestionScreen;
