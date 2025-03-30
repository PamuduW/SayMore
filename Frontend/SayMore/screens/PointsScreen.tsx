import React, { useMemo } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

/**
 * PointsScreen component that displays the user's points and provides navigation to quizzes.
 * @param {object} route - The route object containing navigation parameters.
 * @param {object} navigation - The navigation object for navigating between screens.
 * @returns {JSX.Element} The rendered component.
 */
const PointsScreen = ({ route, navigation }) => {
  const { points, totalPoints } = route.params;
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0), []);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, scaleAnim]);

  /**
   * Navigates to the QuizzesNavScreen.
   */
  const handleGoQuiz = () => {
    navigation.navigate('QuizzesNavScreen', { screen: 'QuizzesNavScreen' });
  };

  return (
    <LinearGradient
      colors={['#3B5998', '#577BC1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <Animated.Image
        source={require('../assets/trophy.png')}
        style={[
          styles.trophyImage,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />

      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Congratulations!
      </Animated.Text>

      <Animated.View
        style={[
          styles.pointsCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <Text style={styles.pointsText}>You Scored:</Text>
        <Text style={styles.points}>
          {points} / {totalPoints}
        </Text>
      </Animated.View>

      <TouchableOpacity activeOpacity={0.9} onPress={handleGoQuiz}>
        <LinearGradient
          colors={['#4CAF50', '#2ecc71']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quizButton}>
          <Text style={styles.quizButtonText}>Go to Quizzes & Challenges</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyImage: {
    width: 220,
    height: 220,
    marginBottom: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 25,
    letterSpacing: 1,
  },
  pointsCard: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
    width: width * 0.8,
    marginBottom: 35,
  },
  pointsText: {
    fontSize: 20,
    color: '#2A2D57',
    marginBottom: 10,
  },
  points: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quizButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default PointsScreen;
