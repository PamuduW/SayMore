import React from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const PointsScreen = ({ route }) => {
  const { points, totalPoints } = route.params;
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/trophy.png')} style={styles.trophyImage} />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Congratulations!</Animated.Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.pointsText}>You Scored:</Text>
        <Text style={styles.points}>{points} / {totalPoints}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  trophyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  pointsText: {
    fontSize: 18,
    color: '#34495e',
  },
  points: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default PointsScreen;