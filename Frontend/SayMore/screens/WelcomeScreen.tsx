import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

/**
 * WelcomeScreen component.
 * Displays a welcome screen with a fading logo animation.
 *
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object.
 * @returns {JSX.Element} The rendered WelcomeScreen component.
 */
const WelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/applogo.jpg")}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default WelcomeScreen;
