import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import AudioRecord from "react-native-audio-record";
import Sound from "react-native-sound";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { request, PERMISSIONS } from "react-native-permissions";

/**
 * AudioRecorder component allows users to record, play, and upload audio files.
 * It handles permissions, recording, playback, and uploading to Firebase.
 */
const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    requestPermissions();
    AudioRecord.init({
      sampleRate: 44100,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: "recordedAudio.wav",
    });
  }, []);

  /**
   * Requests necessary permissions for recording audio.
   */
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    } else {
      await request(PERMISSIONS.IOS.MICROPHONE);
    }
  };

  /**
   * Starts audio recording.
   */
  const startRecording = () => {
    setIsRecording(true);
    AudioRecord.start();
  };

  /**
   * Stops audio recording and sets the audio path.
   */
  const stopRecording = async () => {
    setIsRecording(false);
    setAudioPath(await AudioRecord.stop());
  };

  /**
   * Plays the recorded audio.
   */
  const playAudio = () => {
    if (!audioPath) {
      Alert.alert("No Audio", "Please record audio before playing.");
      return;
    }
    const soundInstance = new Sound(audioPath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        Alert.alert("Playback Error", error.message);
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
   * Stops audio playback.
   */
  const stopAudio = () => {
    sound?.stop(() => setSound(null));
  };

  /**
   * Uploads the recorded audio to Firebase storage.
   */
  const uploadAudio = async () => {
    if (!audioPath) {
      Alert.alert("No Audio", "Please record audio before uploading.");
      return;
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    const filename = `recordings/${currentUser.uid}+${new Date().toISOString()}.wav`;
    const reference = storage().ref(filename);
    try {
      await reference.putFile(audioPath, { contentType: "audio/wav" });
      navigation.navigate("AnalysisScreen", { filename, acc_id: currentUser.uid });
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.button, isRecording ? styles.recording : styles.notRecording]}>
        <Text style={styles.buttonText}>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={sound ? stopAudio : playAudio}
        style={[styles.button, sound ? styles.playing : styles.notPlaying]}>
        <Text style={styles.buttonText}>{sound ? "Stop Playback" : "Play Audio"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={uploadAudio} style={[styles.button, styles.upload]}>
        <Text style={styles.buttonText}>Upload to Firebase</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  recording: {
    backgroundColor: "red",
  },
  notRecording: {
    backgroundColor: "green",
  },
  playing: {
    backgroundColor: "orange",
  },
  notPlaying: {
    backgroundColor: "blue",
  },
  upload: {
    backgroundColor: "purple",
  },
});

export default AudioRecorder;
