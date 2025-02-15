import React from "react";
import { View, StyleSheet } from "react-native";
import AudioRecorder from "../components/AudioRecorder";

/**
 * AudioScreen component.
 * Displays the AudioRecorder component within a styled container.
 *
 * @returns {JSX.Element} The rendered AudioScreen component.
 */
const AudioScreen = () => (
  <View style={styles.container}>
    <AudioRecorder />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AudioScreen;
