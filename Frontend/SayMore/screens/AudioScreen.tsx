import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AudioRecorder from "../components/AudioRecorder";
import { RouteProp } from '@react-navigation/native';

interface AudioScreenProps {
  route: RouteProp<{ params: { isPublicSpeaking: boolean } }, 'params'>;
}

const AudioScreen: React.FC<AudioScreenProps> = ({ route }) => {
  const { isPublicSpeaking } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{isPublicSpeaking ? "Public Speaking" : "Stuttering"}</Text>
      <AudioRecorder isPublicSpeaking={isPublicSpeaking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
});

export default AudioScreen;