import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

interface FeedbackScreen_PSProps {
  route: {
    params: {
      final_public_speaking_score: number;
      final_public_speaking_feedback: string;
      voiceBaseFeedback: string;
      voiceDynamicFeedback: string;
      speechBaseFeedback: string;
      speechDynamicFeedback: string;
      threeSmallestScores: {
        name: string;
        value: number;
        navigationTarget: string | null;
      }[];
    };
  };
}

/**
 * FeedbackScreen_PS component that displays feedback for public speaking performance.
 * @param {FeedbackScreen_PSProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
const FeedbackScreen_PS: React.FC<FeedbackScreen_PSProps> = ({ route }) => {
  const {
    final_public_speaking_score,
    final_public_speaking_feedback,
    voiceBaseFeedback,
    voiceDynamicFeedback,
    speechBaseFeedback,
    speechDynamicFeedback,
    threeSmallestScores,
  } = route.params;

  const navigation = useNavigation();
  const theme = useTheme();

  /**
   * Handles the navigation to the improvement screen based on the score.
   * @param {string | null} navigationTarget - The target screen to navigate to.
   */
  const handleImprove = (navigationTarget: string | null) => {
    if (navigationTarget) {
      navigation.navigate(navigationTarget);
    } else {
      Alert.alert(
        'Notice',
        'No specific screen to navigate to for this score.'
      );
    }
  };

  /**
   * Handles the back button press to navigate to the previous screen.
   */
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.backButtonWrapper}>
        <Image
          source={require('../assets/back.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Speech Feedback</Text>

        <View style={styles.feedbackBlock}>
          <Text style={styles.label}>Final Public Speaking Score</Text>
          <Text style={styles.valueHighlight}>
            {final_public_speaking_score}
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
        {threeSmallestScores.map((score, index) => (
          <View key={index} style={styles.scoreItem}>
            <View>
              <Text style={styles.scoreName}>{score.name}</Text>
              <Text style={styles.scoreValue}>Score: {score.value}</Text>
            </View>
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
    backgroundColor: '#034694',
    padding: 16,
    borderRadius: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 16,
    color: '#D0D3E6',
  },
  valueHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
