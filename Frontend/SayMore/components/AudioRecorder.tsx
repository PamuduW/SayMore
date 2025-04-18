import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { request, PERMISSIONS } from 'react-native-permissions';

interface AudioRecorderProps {
  isPublicSpeaking: boolean;
  language: string;
}

/**
 * AudioRecorder component for recording, playing, and uploading audio.
 * @param {AudioRecorderProps} props - The properties for the component.
 * @param {boolean} props.isPublicSpeaking - Indicates if the recording is for public speaking.
 * @param {string} props.language - The language of the recording.
 * @returns {JSX.Element} The rendered component.
 */
const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isPublicSpeaking,
  language,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    requestPermissions();
    initRecorder();
  }, []);

  /**
   * Requests necessary permissions for recording audio.
   */
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } else {
      await request(PERMISSIONS.IOS.MICROPHONE);
    }
  };

  /**
   * Initializes the audio recorder with the specified settings.
   */
  const initRecorder = async () => {
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'recordedAudio.wav',
    });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay to ensure initialization
  };

  /**
   * Starts recording audio.
   */
  const startRecording = async () => {
    setIsRecording(true);
    setUploadMessage(null);
    await initRecorder();
    AudioRecord.start();
  };

  /**
   * Stops recording audio and saves the file.
   */
  const stopRecording = async () => {
    setIsRecording(false);
    const rawAudioPath = await AudioRecord.stop();

    const wavFilePath = `${RNFS.DocumentDirectoryPath}/recordedAudio.wav`;
    try {
      await RNFS.moveFile(rawAudioPath, wavFilePath);
      setAudioPath(wavFilePath);
    } catch (error) {
      Alert.alert('Error', 'Error saving WAV file');
    }
  };

  /**
   * Plays the recorded audio.
   */
  const playAudio = () => {
    if (!audioPath) {
      Alert.alert('No Audio', 'Please record audio before playing.');
      return;
    }
    const soundInstance = new Sound(audioPath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        Alert.alert('Playback Error', error.message);
        return;
      }
      soundInstance.play(() => {
        soundInstance.release();
        setSound(null);
      });
    });
    setSound(soundInstance);
  };

  /**
   * Stops the audio playback.
   */
  const stopAudio = () => {
    sound?.stop(() => setSound(null));
  };

  /**
   * Uploads the recorded audio to Firebase storage.
   */
  const uploadAudio = async () => {
    if (!audioPath) {
      Alert.alert('No Audio', 'Please record audio before uploading.');
      return;
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    const folder = isPublicSpeaking ? 'PS_Check' : 'Stuttering_Check';
    const date = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
    const filename = `recordings/${folder}/${currentUser.uid}+${date}.wav`;
    const reference = storage().ref(filename);

    try {
      await reference.putFile(audioPath, { contentType: 'audio/wav' });
      setUploadMessage('✅ Audio successfully uploaded!');
      navigation.navigate('AnalysisScreen', {
        filename,
        acc_id: currentUser.uid,
        type: isPublicSpeaking,
        language,
      });
    } catch (error) {
      Alert.alert('Upload Failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/recordScreen.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Audio Recorder</Text>

        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[
            styles.recordingButton,
            isRecording ? styles.recording : styles.notRecording,
          ]}>
          <Image
            source={require('../assets/mic.png')}
            style={styles.recordingIcon}
          />
        </TouchableOpacity>

        <Text style={styles.description}>
          Tap the microphone to start recording, and tap again to stop
        </Text>

        <TouchableOpacity
          onPress={sound ? stopAudio : playAudio}
          style={[styles.button, sound ? styles.playing : styles.notPlaying]}>
          <Text style={styles.buttonText}>
            {sound ? 'Stop Playback' : 'Play Audio'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={uploadAudio}
          style={[styles.button, styles.upload]}>
          <Text style={styles.buttonText}>Upload to Firebase</Text>
        </TouchableOpacity>

        {uploadMessage && (
          <Text style={styles.successMessage}>{uploadMessage}</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  description: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    margin: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordingButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  recording: {
    backgroundColor: '#f44336',
  },
  notRecording: {
    backgroundColor: '#2196F3',
  },
  playing: {
    backgroundColor: '#A0C878',
  },
  notPlaying: {
    backgroundColor: '#27667B',
  },
  upload: {
    backgroundColor: '#DF6D14',
  },
  successMessage: {
    marginTop: 15,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
});

export default AudioRecorder;
