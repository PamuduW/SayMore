import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  PointsScreen: {
    points: number;
    videoTitle: string;
    milestones?: number[];
    maxPossiblePoints?: number;
  };
};

type PointsScreenRouteProp = RouteProp<RootStackParamList, 'PointsScreen'>;

const { width } = Dimensions.get('window');

const PointsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PointsScreenRouteProp>();
  const { points, videoTitle, milestones = [], maxPossiblePoints = 10 } = route.params;

  // Animation values
  const pointsAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animate points counting up
    Animated.timing(pointsAnim, {
      toValue: points,
      duration: 1000,
      useNativeDriver: false
    }).start();

    // Animate scale bounce effect
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true
    }).start();
  }, [points]);

  // Get messaging based on points earned
  const getMessageText = () => {
    const percentage = (points / maxPossiblePoints) * 100;

    if (percentage >= 100) {
      return "Perfect! You've earned all available points!";
    } else if (percentage >= 70) {
      return "Great job! You've earned most of the available points!";
    } else if (percentage >= 40) {
      return "Good work! Keep watching to earn more points next time!";
    } else {
      return "You've earned some points! Complete the full video for maximum points.";
    }
  };

  // Get milestone details text
  const getMilestoneText = () => {
    if (milestones.length === 0) {
      return "Watch more to reach milestones!";
    }

    let basePoints = milestones.length - (milestones.includes(100) ? 1 : 0);
    let completionBonus = milestones.includes(100) ? (maxPossiblePoints - basePoints) : 0;

    return milestones.includes(100)
      ? `${basePoints} points from milestones + ${completionBonus} completion bonus!`
      : `${basePoints} points from reaching milestone${basePoints > 1 ? 's' : ''}: ${milestones.join('%, ')}%`;
  };

  // Animated points value for display
  const animatedPoints = pointsAnim.interpolate({
    inputRange: [0, points],
    outputRange: [0, points]
  });

  const continueToLesson = () => {
    navigation.goBack();
  };

  const goToHome = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.pointsContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.pointsCircle}>
            <Animated.Text style={styles.pointsNumber}>
              {animatedPoints.interpolate({
                inputRange: [0, points],
                outputRange: ['0', points.toString()]
              })}
            </Animated.Text>
            <Text style={styles.pointsLabel}>POINTS</Text>
          </View>
        </Animated.View>

        <View style={styles.messageContainer}>
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.videoTitle} numberOfLines={2} ellipsizeMode="tail">
            You completed "{videoTitle}"
          </Text>
          <Text style={styles.messageText}>{getMessageText()}</Text>
          <Text style={styles.milestoneText}>{getMilestoneText()}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {`You earned ${points} out of ${maxPossiblePoints} possible points`}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(points / maxPossiblePoints) * 100}%` }]} />
          </View>

          {/* Display milestone markers */}
          <View style={styles.milestoneMarkersContainer}>
            <View style={[styles.milestoneTick, { left: '10%' }]}>
              <Text style={[styles.milestoneTickText, milestones.includes(10) ? styles.reachedMilestone : {}]}>10%</Text>
            </View>
            <View style={[styles.milestoneTick, { left: '25%' }]}>
              <Text style={[styles.milestoneTickText, milestones.includes(25) ? styles.reachedMilestone : {}]}>25%</Text>
            </View>
            <View style={[styles.milestoneTick, { left: '50%' }]}>
              <Text style={[styles.milestoneTickText, milestones.includes(50) ? styles.reachedMilestone : {}]}>50%</Text>
            </View>
            <View style={[styles.milestoneTick, { left: '75%' }]}>
              <Text style={[styles.milestoneTickText, milestones.includes(75) ? styles.reachedMilestone : {}]}>75%</Text>
            </View>
            <View style={[styles.milestoneTick, { right: '0%' }]}>
              <Text style={[styles.milestoneTickText, milestones.includes(100) ? styles.reachedMilestone : {}]}>100%</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={continueToLesson}
          >
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={goToHome}
          >
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
    backgroundColor: '#4CAF50',
  },
  milestoneMarkersContainer: {
    position: 'relative',
    width: '100%',
    height: 20,
  },
  milestoneTick: {
    position: 'absolute',
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

export default PointsScreen;