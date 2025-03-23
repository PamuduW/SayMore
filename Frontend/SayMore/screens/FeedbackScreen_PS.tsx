import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

// Props interface for the FeedbackScreen_PS component, containing the parameters passed from the previous screen.
interface FeedbackScreen_PSProps {
  route: {
    params: {
      final_public_speaking_score: number; // The final score for public speaking
      final_public_speaking_feedback: string; // Overall feedback for public speaking
      voiceBaseFeedback: string; // Base voice feedback
      voiceDynamicFeedback: string; // Dynamic voice feedback
      speechBaseFeedback: string; // Base speech energy feedback
      speechDynamicFeedback: string; // Dynamic speech energy feedback
      threeSmallestScores: { // The three lowest scores with names and possible navigation targets
        name: string;
        value: number;
        navigationTarget: string | null;
      }[];
    };
  };
}

// Main functional component for FeedbackScreen_PS
const FeedbackScreen_PS: React.FC<FeedbackScreen_PSProps> = ({ route }) => {
  // Destructuring the feedback data passed from the previous screen
  const {
    final_public_speaking_score,
    final_public_speaking_feedback,
    voiceBaseFeedback,
    voiceDynamicFeedback,
    speechBaseFeedback,
    speechDynamicFeedback,
    threeSmallestScores,
  } = route.params;

  const navigation = useNavigation(); // Hook to navigate to other screens
  const theme = useTheme(); // Custom hook for managing theme (dark or light)

  // Function to handle navigation to a specific screen based on the smallest scores
  const handleImprove = (navigationTarget: string | null) => {
    if (navigationTarget) {
      navigation.navigate(navigationTarget); // Navigate to the respective screen if available
    } else {
      alert('No specific screen to navigate to for this score.'); // Show alert if no navigation target
    }
  };

  // Function to go back to the previous screen
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    // Main container using LinearGradient for background color
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.backButtonWrapper}>
        <Image
          source={require('../assets/back.png')} // Back button image
          style={styles.backButton}
        />
      </TouchableOpacity>

      {/* Main content in a ScrollView */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Speech Feedback</Text>

        {/* Feedback blocks displaying different categories of feedback */}
        <View style={styles.feedbackBlock}>
          <Text style={styles.label}>Score</Text>
          <Text style={styles.valueHighlight}>
            {final_public_speaking_score} {/* Displaying the score */}
          </Text>
        </View>

        <View style={styles.feedbackBlock}>
          <Text style={styles.label}>Overall Feedback</Text>
          <Text style={styles.value}>{final_public_speaking_feedback}</Text>
        </View>

        <View style={styles.feedbackBlock}>
          <Text style={styles.label}>Voice Quality</Text>
          <Text style={styles.value}>{voiceBaseFeedback}</Text>
          <Text style={styles.value}>{voiceDynamicFeedback}</Text>
        </View>

        <View style={styles.feedbackBlock}>
          <Text style={styles.label}>Speech Energy</Text>
          <Text style={styles.value}>{speechBaseFeedback}</Text>
          <Text style={styles.value}>{speechDynamicFeedback}</Text>
        </View>

        <Text style={styles.subtitle}>Top Areas to Improve</Text>
        {/* Mapping through the three smallest scores and displaying them */}
        {threeSmallestScores.map((score, index) => (
          <View key={index} style={styles.scoreItem}>
            <View>
              <Text style={styles.scoreName}>{score.name}</Text>
              <Text style={styles.scoreValue}>Score: {score.value}</Text>
            </View>
            {/* Button to navigate to the improvement screen for each score */}
            <TouchableOpacity
              onPress={() => handleImprove(score.navigationTarget)}>
              <LinearGradient
                colors={
                  theme === 'dark'
                    ? ['#1C1C1C', '#3A3A3A']
                    : ['#3B5998', '#577BC1']
                }
                style={styles.improveButton}>
                <Text style={styles.improveText}>Improve</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

// Styles for the FeedbackScreen_PS component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingBottom: 40,
    paddingTop: 50,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  feedbackBlock: {
    marginBottom: 20,
    backgroundColor: '#034694', // Background color for feedback blocks
    padding: 16,
    borderRadius: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#D0D3E6', // Light gray color for text
  },
  valueHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for highlighting score
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slight transparency for score items
    marginBottom: 10,
    borderRadius: 15,
  },
  scoreName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreValue: {
    fontSize: 14,
    color: '#D0D3E6',
  },
  improveButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  improveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default FeedbackScreen_PS;