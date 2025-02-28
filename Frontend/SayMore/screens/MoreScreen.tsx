import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";

/**
 * Array of screen titles with corresponding icons.
 */
const NewScreens = [
  { title: "Activity", icon: require("../assets/activity2.png") },
  { title: "Lesson", icon: require("../assets/lesson.jpg") },
  { title: "Quizzes and Challenges", icon: require("../assets/quiz.jpg") },
  { title: "Progress", icon: require("../assets/progress.jpg") },
  { title: "Points", icon: require("../assets/points.jpg")},
  { title: "Leaderboard", icon: require("../assets/leaderboard.jpg")},
  { title: "Speech Therapy", icon:require("../assets/speech.jpg")},
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
   * Navigates to the appropriate screen.
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
        {NewScreens.map((item, index) => (
          <TouchableOpacity key={index} style={styles.lessonButton} onPress={() => handlePress(item.title)}>
            {item.icon ? <Image source={item.icon} style={styles.lessonIcon} /> : null}
            <Text style={styles.lessonText}>{item.title}</Text>
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
  lessonIcon: { width: 50, height: 50, marginBottom: 10 },
  lessonText: { fontSize: 14, fontWeight: "bold", color: "#003366", textAlign: "center" },
});

export default MoreScreen;
