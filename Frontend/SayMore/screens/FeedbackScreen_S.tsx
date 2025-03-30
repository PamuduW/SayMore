import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

interface FeedbackScreenSProps {
  route: {
    params: {
      dynamic_feedback: string;
      stutter_count: number;
      stuttering_score: number;
    };
  };
}

/**
 * FeedbackScreen_S component that displays feedback for stuttering performance.
 * @param {FeedbackScreenSProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
const FeedbackScreen_S: React.FC<FeedbackScreenSProps> = ({ route }) => {
  const { dynamic_feedback, stutter_count, stuttering_score } = route.params;
  const navigation = useNavigation();
  const theme = useTheme();

  /**
   * Handles the press event to navigate to the appropriate improvement screen.
   */
  const handleImprovePress = () => {
    if (stutter_count > 3) {
      navigation.navigate('UnderstandingAndOvercomingStutteringScreen');
    } else {
      navigation.navigate('LessonRedirectionStuttering');
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

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Speech Feedback</Text>

        <View style={styles.feedbackBlock}>
          <Text style={styles.label}>Final Stutter Score</Text>
          <Text style={styles.valueHighlight}>{stuttering_score}</Text>
        </View>

        <View style={styles.feedbackBlock}>
          <Text style={styles.label}>Dynamic Feedback</Text>
          <Text style={styles.value}>{dynamic_feedback}</Text>
        </View>

        <TouchableOpacity onPress={handleImprovePress}>
          <LinearGradient
            colors={
              theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#3B5998', '#577BC1']
            }
            style={styles.improveButton}>
            <Text style={styles.improveText}>Improve</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    paddingBottom: 40,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
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
  feedbackBlock: {
    marginBottom: 20,
    backgroundColor: '#034694',
    padding: 16,
    borderRadius: 15,
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

export default FeedbackScreen_S;
