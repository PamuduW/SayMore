import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

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
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, scaleAnim]);

  const handleGoHome = () => {
    navigation.navigate('Home', { screen: 'HomeScreen' });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/trophy.png')}
        style={styles.trophyImage}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Congratulations!
      </Animated.Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.pointsText}>You Scored:</Text>
        <Text style={styles.points}>
          {points} / {totalPoints}
        </Text>
      </Animated.View>
      <TouchableOpacity onPress={handleGoHome} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#122f4d',
  },
  trophyImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  pointsText: {
    fontSize: 25,
    color: '#fff',
  },
  points: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  homeButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PointsScreen;
