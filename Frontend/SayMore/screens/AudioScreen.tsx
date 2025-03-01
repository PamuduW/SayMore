import React, { useState } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import AudioRecorder from "../components/AudioRecorder";
import { RouteProp } from '@react-navigation/native';

interface AudioScreenProps {
  route: RouteProp<{ params: { isPublicSpeaking: boolean } }, 'params'>;
}

const AudioScreen: React.FC<AudioScreenProps> = ({ route }) => {
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
      <Text style={styles.headerText}>{isPublicSpeaking ? "Public Speaking" : "Stuttering"}</Text>
      <AudioRecorder isPublicSpeaking={isPublicSpeaking} language={language} />
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