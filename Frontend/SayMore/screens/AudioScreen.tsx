import React, { useState } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import AudioRecorder from "../components/AudioRecorder";

const AudioScreen = ({ route }) => {
  const { isPublicSpeaking } = route.params;
  const [language, setLanguage] = useState<string | null>(null);

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
  };

  if (isPublicSpeaking && !language) {
    return (
      <View style={styles.container}>
        <Text>Select a language:</Text>
        <Button title="English" onPress={() => selectLanguage("en")} />
        <Button title="Sinhala" onPress={() => selectLanguage("si")} />
        <Button title="Tamil" onPress={() => selectLanguage("ta")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{isPublicSpeaking ? "Public Speaking" : "Stuttering"}</Text>
      <AudioRecorder isPublicSpeaking={isPublicSpeaking} language={language} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioScreen;