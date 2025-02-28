import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

/**
 * Array of lesson titles.
 */
const lessons = [
  "Speech Exercises",
  "Understanding Stuttering",
  "Building Confidence",
  "Communication Tips",
  "Techniques for Overcoming Stuttering",
  "Managing Stage Fright",
];

interface LessonsScreenProps {}

/**
 * LessonsScreen component.
 * Displays a list of lessons with educational videos, tips, and techniques.
 *
 * @returns {JSX.Element} The rendered LessonsScreen component.
 */
const LessonsScreen: React.FC<LessonsScreenProps> = () => (
  <View style={styles.container}>
    <Text style={styles.headerText}>Hi, Aria</Text>
    <Text style={styles.subText}>
      Unlock your potential as a confident speaker. Explore our educational videos, tips, and
      techniques designed to help you overcome stuttering, build confidence, and communicate with
      clarity to become the speaker you’ve always wanted to be!
    </Text>
    <View style={styles.gridContainer}>
      {lessons.map((title, index) => (
        <TouchableOpacity key={index} style={styles.lessonButton}>
          <Image source={require("../assets/videoicon.png")} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>{title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF", padding: 20 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#003366", marginBottom: 10 },
  subText: { fontSize: 16, color: "#003366", marginBottom: 20 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  lessonButton: {
    width: "48%",
    backgroundColor: "#E6F7FF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  lessonIcon: { width: 40, height: 40, marginBottom: 10 },
  lessonText: { fontSize: 14, fontWeight: "bold", color: "#003366", textAlign: "center" },
});

export default LessonsScreen;