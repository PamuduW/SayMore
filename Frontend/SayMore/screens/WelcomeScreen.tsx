import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WelcomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.welcomeText}>Welcome to the App!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F0F8FF" },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: "#003366" },
});

export default WelcomeScreen;
