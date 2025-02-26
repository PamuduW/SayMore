import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from "react-native";
import { useNotifications } from "../components/Notifications";
import { NavigationProp } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

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

  // Animated border effect
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      })
    ).start();
  }, [borderAnimation]);

  const borderInterpolation = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#2D336B", "#7886C7"], // Gradient transition colors
  });

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
    <LinearGradient colors={["#2A2D57", "#577BC1"]} style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image style={styles.icon} source={require("../assets/icon.png")} />
        <Text style={styles.greeting}>Welcome to Say More!</Text>
        <Text style={styles.welcomeMessage}>Enhance your speech & confidence!</Text>
      </View>

      {/* Test Section */}
      <View style={styles.testContainer}>
        <Text style={styles.testHeading}>Start Your Test</Text>
        <Image style={styles.testImage} source={require("../assets/public-speaking.png")} />

        <View style={styles.testOptions}>
          {["Public Speaking", "Stuttering"].map((option, index) => (
            <Animated.View
              key={index}
              style={[styles.optionButtonWrapper, { borderColor: borderInterpolation }]}
            >
              <LinearGradient
                colors={["#3B5998", "#577BC1"]}
                style={styles.optionButton}
              >
                <TouchableOpacity onPress={() => handlePress(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },

  header: { alignItems: "center", marginBottom: 40 },
  icon: { width: 80, height: 80, marginBottom: 15 },
  greeting: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF" },
  welcomeMessage: { fontSize: 18, color: "#D0D3E6", textAlign: "center", marginTop: 5 },

  testContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },

  testHeading: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#2A2D57" },
  testImage: { width: 220, height: 220, marginBottom: 25 },
  icon: { width: 70, height: 70, marginBottom: 15 },

  testOptions: { flexDirection: "row", justifyContent: "center", gap: 15 },

  optionButtonWrapper: {
    borderWidth: 3,
    borderRadius: 20,
    overflow: "hidden",
  },

  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: 150,
    height: 50,
  },

  optionText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
});

export default HomeScreen;