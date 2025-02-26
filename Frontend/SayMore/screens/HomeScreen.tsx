import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNotifications } from "../components/Notifications";
import { NavigationProp } from '@react-navigation/native';

/**
 * HomeScreen component.
 * Displays a welcome message and options for starting tests.
 *
 * @param {Object} navigation - The navigation object used to navigate between screens.
 * @returns {JSX.Element} The rendered HomeScreen component.
 */
interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  useNotifications();

  /**
   * Handles the press event for the test options.
   * Navigates to the Audio screen if the selected option is "Public Speaking" or "Stuttering".
   *
   * @param {string} option - The selected test option.
   */
  const handlePress = (option: string) => {
    const isPublicSpeaking = option === "Public Speaking";
    navigation.navigate("Audio", { isPublicSpeaking });
  };

  return (
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
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handlePress(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF", padding: 20 },
  header: { marginTop: 40, alignItems: "center" },
  greeting: { fontSize: 30, fontWeight: "bold", color: "#003366" },
  welcomeMessage: { fontSize: 22, color: "#003366" },
  testContainer: {
    marginTop: 60,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  testHeading: { fontSize: 30, fontWeight: "bold", marginBottom: 25 },
  testImage: { width: 200, height: 200, marginBottom: 30 },
  testOptions: { flexDirection: "row", justifyContent: "space-between", width: "115%" },
  optionButton: {
    flex: 1,
    backgroundColor: "#87CEEB",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  optionText: { color: "#003366", fontWeight: "bold", fontSize: 15 },
});

export default HomeScreen;