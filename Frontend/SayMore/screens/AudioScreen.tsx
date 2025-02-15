import React from "react";
import { View, StyleSheet } from "react-native";
import AudioRecorder from "../components/AudioRecorder";

export default function AudioScreen() {
  return (
    <View style={styles.container}>
      <AudioRecorder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
