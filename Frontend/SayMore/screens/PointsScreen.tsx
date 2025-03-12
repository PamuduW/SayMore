import React from "react";
import { View, Text, StyleSheet, Button, Animated, Image } from "react-native";
import { useEffect, useRef } from "react";

const PointsScreen = ({ route, navigation }) => {
  const { points, totalPoints } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/trophy.png')} style={styles.trophyImage} />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Congratulations!</Animated.Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.pointsText}>You Scored:</Text>
        <Text style={styles.pointsNumber}>{points} / {totalPoints}</Text>
      </Animated.View>
      <Button title="Go Home" onPress={() => navigation.navigate("Home")} color="#9ca1db" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292d61",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  trophyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: "#FFD700",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pointsText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  pointsNumber: {
    color: "#FFD700",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
});

export default PointsScreen;