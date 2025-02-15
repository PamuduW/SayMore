import React from "react";
import { View } from "react-native";
import AudioRecorder from "../components/AudioRecorder";

export default function AudioScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AudioRecorder />
    </View>
  );
}
