import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
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

  if (!language) {
    return (
      <View style={styles.container}>
        {/* White Panel for Language Selection */}
        <View style={styles.whitePanel}>
          <Text style={styles.headerText}>Select a Language:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => selectLanguage('en')}>
              <Text style={styles.buttonText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => selectLanguage('si')}>
              <Text style={styles.buttonText}>සිංහල</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => selectLanguage('ta')}>
              <Text style={styles.buttonText}>தமிழ்</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* No White Panel here for Audio */}
      <Text style={styles.headerText}>{isPublicSpeaking ? '🎤 Public Speaking' : '🗣️ Stuttering'}</Text>
      <Text style={styles.subText}>Language: {language.toUpperCase()}</Text>
      <AudioRecorder isPublicSpeaking={isPublicSpeaking} language={language} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#08405e',
  },
  whitePanel: {
    width: '70%',
    height: '100%',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonGroup: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    backgroundColor: '#007AFF',
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
  subText: {
    fontSize: 18,
    color: '#fff',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AudioScreen;
