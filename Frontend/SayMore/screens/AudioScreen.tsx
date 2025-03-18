import React, { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import AudioRecorder from '../components/AudioRecorder';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';

interface AudioScreenProps {
  route: RouteProp<{ params: { isPublicSpeaking: boolean } }, 'params'>;
}

const AudioScreen: React.FC<AudioScreenProps> = ({ route }) => {
  const { isPublicSpeaking } = route.params;
  const [language, setLanguage] = useState<string | null>(null);
  const theme = useTheme();

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
  };

  if (!language && isPublicSpeaking) {
    return (
      <View
        style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
        <Text style={theme === 'dark' ? styles.darkText : styles.lightText}>
          Select a language:
        </Text>
        <Button title="English" onPress={() => selectLanguage('english')} />
        <Button title="Sinhala" onPress={() => selectLanguage('sinhala')} />
        <Button title="Tamil" onPress={() => selectLanguage('tamil')} />
      </View>
    );
  }


  return (
    <View
      style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <Text
        style={
          theme === 'dark' ? styles.darkHeaderText : styles.lightHeaderText
        }>
        {isPublicSpeaking ? 'Public Speaking' : 'Stuttering'}
      </Text>
      <Text
        style={
          theme === 'dark' ? styles.darkHeaderText : styles.lightHeaderText
        }>
        {language ? language : 'screen'}
      </Text>
      <AudioRecorder isPublicSpeaking={isPublicSpeaking} language={language} />
    </View>
  );
};

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
  lightHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  darkHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  lightText: {
    fontSize: 18,
    color: '#333',
  },
  darkText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default AudioScreen;
