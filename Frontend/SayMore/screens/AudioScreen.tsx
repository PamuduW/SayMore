import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AudioRecorder from "../components/AudioRecorder";

/**
 * AudioScreen component.
 * Displays the AudioRecorder component within a styled container.
 *
 * @param {object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered AudioScreen component.
 */
const AudioScreen = ({ route }) => {
  const { isPublicSpeaking } = route.params;

  return (
    <View style={styles.container}>
      <Text>{isPublicSpeaking ? "Public Speaking" : "Stuttering"}</Text>
      <AudioRecorder isPublicSpeaking={isPublicSpeaking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AudioScreen;
