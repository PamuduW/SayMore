import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";

/**
 * Array of screen titles.
 */
const NewScreens = [
  "Activity",
  "Lesson",
  "Quizzes and Challenges",
  "Progress",
  "Points",
  "Leaderboard",
  "Speech Therapy",
];

interface MoreScreenProps {
  navigation: NavigationProp<any>;
}

/**
 * MoreScreen component.
 * Displays a grid of options for different screens.
 *
 * @param {MoreScreenProps} props - The props for the component.
 * @returns {JSX.Element} The rendered MoreScreen component.
 */
const MoreScreen: React.FC<MoreScreenProps> = ({ navigation }) => {
  /**
   * Handles the press event for the screen options.
   * Navigates to the Lessons screen if the selected option is "Lesson".
   *
   * @param {string} title - The selected screen title.
   */
  const handlePress = (title: string) => {
    if (title === "Lesson") {
      navigation.navigate("Lessons");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {NewScreens.map((title, index) => (
          <TouchableOpacity key={index} style={styles.lessonButton} onPress={() => handlePress(title)}>
            <Image source={require("../assets/videoicon.png")} style={styles.lessonIcon} />
            <Text style={styles.lessonText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF", padding: 20 },
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

export default MoreScreen;