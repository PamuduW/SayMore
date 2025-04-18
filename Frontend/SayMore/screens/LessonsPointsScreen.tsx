import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  LessonsPointsScreen: {
    points: number;
    videoTitle: string;
    milestones: number[];
    maxPossiblePoints: number;
  };
  TabNavigation: undefined;
};

type LessonsPointsScreenRouteProp = RouteProp<
  RootStackParamList,
  'LessonsPointsScreen'
>;

const { width } = Dimensions.get('window');

/**
 * LessonsPointsScreen component that displays the points earned by the user for a lesson.
 * @returns {JSX.Element} The rendered component.
 */
const LessonsPointsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<LessonsPointsScreenRouteProp>();
  const { points, videoTitle, milestones, maxPossiblePoints } = route.params;

  useEffect(() => {}, [points, videoTitle, milestones, maxPossiblePoints]);

  /**
   * Returns a message based on the percentage of points earned.
   * @returns {string} The message text.
   */
  const getMessageText = () => {
    const percentage = (points / maxPossiblePoints) * 100;

    if (percentage >= 100) {
      return "Perfect! You've earned all available points!";
    } else if (percentage >= 70) {
      return "Great job! You've earned most of the available points!";
    } else if (percentage >= 40) {
      return 'Good work! Keep watching to earn more points next time!';
    } else {
      return "You've earned some points! Complete the full video for maximum points.";
    }
  };

  /**
   * Returns a message based on the milestones reached.
   * @returns {string} The milestone text.
   */
  const getMilestoneText = () => {
    if (milestones.length === 0) {
      return 'Watch more to reach milestones!';
    }

    let basePoints = milestones.length - (milestones.includes(100) ? 1 : 0);

    return milestones.includes(100)
      ? `${basePoints} points from milestones + completion bonus!`
      : `${basePoints} points from reaching milestone${basePoints > 1 ? 's' : ''}: ${milestones.join('%, ')}%`;
  };

  /**
   * Navigates back to the previous screen.
   */
  const continueToLesson = () => {
    navigation.goBack();
  };

  /**
   * Navigates to the Home screen.
   */
  const goToHome = () => {
    navigation.navigate('TabNavigation');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
      <View style={styles.container}>
        <View style={[styles.pointsContainer]}>
          <View style={styles.pointsCircle}>
            <Text style={styles.pointsNumber}>{points}</Text>
            <Text style={styles.pointsLabel}>POINTS</Text>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text
            style={styles.videoTitle}
            numberOfLines={2}
            ellipsizeMode="tail">
            You completed "{videoTitle}"
          </Text>
          <Text style={styles.messageText}>{getMessageText()}</Text>
          <Text style={styles.milestoneText}>{getMilestoneText()}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>You earned {points} points</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill}>
              <View style={styles.progressSection1} />
              <View style={styles.progressSection2} />
              <View style={styles.progressSection3} />
              <View style={styles.progressSection4} />
            </View>
          </View>

          {/* Display milestone markers */}
          <View style={styles.milestoneMarkersContainer}>
            <View style={styles.milestoneTick1}>
              <Text
                style={[
                  styles.milestoneTickText,
                  milestones.includes(10) ? styles.reachedMilestone : {},
                ]}>
                10%
              </Text>
            </View>
            <View style={styles.milestoneTick2}>
              <Text
                style={[
                  styles.milestoneTickText,
                  milestones.includes(25) ? styles.reachedMilestone : {},
                ]}>
                25%
              </Text>
            </View>
            <View style={styles.milestoneTick3}>
              <Text
                style={[
                  styles.milestoneTickText,
                  milestones.includes(50) ? styles.reachedMilestone : {},
                ]}>
                50%
              </Text>
            </View>
            <View style={styles.milestoneTick4}>
              <Text
                style={[
                  styles.milestoneTickText,
                  milestones.includes(75) ? styles.reachedMilestone : {},
                ]}>
                75%
              </Text>
            </View>
            <View style={styles.milestoneTick5}>
              <Text
                style={[
                  styles.milestoneTickText,
                  milestones.includes(100) ? styles.reachedMilestone : {},
                ]}>
                100%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={continueToLesson}>
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={goToHome}>
            <Text style={styles.secondaryButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pointsCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  pointsNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E1EEFB',
    letterSpacing: 2,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: width * 0.8,
  },
  messageText: {
    fontSize: 16,
    color: '#4A6D8C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 36,
  },
  progressText: {
    fontSize: 14,
    color: '#003366',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E1EEFB',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    flexDirection: 'row',
  },
  progressSection1: {
    width: '25%',
    backgroundColor: '#E91E63',
  },
  progressSection2: {
    width: '25%',
    backgroundColor: '#9C27B0',
  },
  progressSection3: {
    width: '25%',
    backgroundColor: '#3F51B5',
  },
  progressSection4: {
    width: '25%',
    backgroundColor: '#2196F3',
  },
  milestoneMarkersContainer: {
    position: 'relative',
    width: '100%',
    height: 20,
  },
  milestoneTick1: {
    position: 'absolute',
    left: '10%',
    alignItems: 'center',
  },
  milestoneTick2: {
    position: 'absolute',
    left: '25%',
    alignItems: 'center',
  },
  milestoneTick3: {
    position: 'absolute',
    left: '50%',
    alignItems: 'center',
  },
  milestoneTick4: {
    position: 'absolute',
    left: '75%',
    alignItems: 'center',
  },
  milestoneTick5: {
    position: 'absolute',
    right: '0%',
    alignItems: 'center',
  },
  milestoneTickText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  reachedMilestone: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#003366',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#003366',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
});

export default LessonsPointsScreen;
