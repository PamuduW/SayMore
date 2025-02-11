import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const HomeScreen = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello User!</Text>
      <Text style={styles.welcomeMessage}>Welcome Back :)</Text>
    </View>
    <View style={styles.testContainer}>
      <Text style={styles.testHeading}>Start Your Test!</Text>
      <Image style={styles.testImage} source={require("../assets/public-speaking.png")} />
      <View style={styles.testOptions}>
        {["Public Speaking", "Stuttering"].map((option, index) => (
          <TouchableOpacity key={index} style={styles.optionButton}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF", padding: 20 },
  header: { marginTop: 20, alignItems: "center" },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#003366" },
  welcomeMessage: { fontSize: 18, color: "#003366" },
  testContainer: {
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  testHeading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  testImage: { width: 150, height: 150, marginBottom: 20 },
  testOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#87CEEB",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 10,
  },
  optionText: { color: "#003366", fontWeight: "bold" },
});

export default HomeScreen;
