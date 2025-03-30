import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

/**
 * WelcomeScreen component that displays a fading logo animation.
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation object for navigating between screens.
 * @returns {JSX.Element} The rendered component.
 */
const WelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Starts the fade-in animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/applogo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default WelcomeScreen;
