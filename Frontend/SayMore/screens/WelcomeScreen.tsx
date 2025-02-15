import React from "react";
import { View, Text, StyleSheet } from "react-native";

useEffect(() => {
    //Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

return () => clearTimeout(timer);
},[fadeAnim,navigation]);

return(
    <view style={styles.container}>
    <Animated.Image
    source={require('../assets/applogo.jpg')}>
    style={[style.logo, {opacity: fadeAnim}]}
    />
    </view>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
});

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
