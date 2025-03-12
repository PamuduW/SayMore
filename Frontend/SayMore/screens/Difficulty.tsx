import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Difficulty: React.FC = ({ navigation }: any) => {
  const handleSelection = (level: string) => {
    navigation.navigate("PublicSpeakQuestionScreen", { difficulty: level });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Difficulty</Text>

      <TouchableOpacity style={[styles.optionButton, styles.easy]} onPress={() => handleSelection("Easy")}>
        <Text style={styles.optionText}>Easy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionButton, styles.intermediate]} onPress={() => handleSelection("Intermediate")}>
        <Text style={styles.optionText}>Intermediate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionButton, styles.hard]} onPress={() => handleSelection("Hard")}>
        <Text style={styles.optionText}>Hard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#2c3e50" },
  optionButton: { padding: 15, marginVertical: 10, borderRadius: 10, width: "80%", alignItems: "center" },
  easy: { backgroundColor: "#2ecc71" }, // Green for Easy
  intermediate: { backgroundColor: "#f1c40f" }, // Yellow for Intermediate
  hard: { backgroundColor: "#e74c3c" }, // Red for Hard
  optionText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default Difficulty;