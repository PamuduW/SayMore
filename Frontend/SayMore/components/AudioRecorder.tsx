// AudioRecorder.js

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
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isPublicSpeaking - Boolean indicating if the test is for public speaking.
 */
const AudioRecorder = ({ isPublicSpeaking }) => {
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

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    } else {
      await request(PERMISSIONS.IOS.MICROPHONE);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    AudioRecord.start();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setAudioPath(await AudioRecord.stop());
  };

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

  const stopAudio = () => {
    sound?.stop(() => setSound(null));
  };

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
    const folder = isPublicSpeaking ? "PS_Check" : "Stuttering_Check";
    const date = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);
    const filename = `recordings/${folder}/${currentUser.uid}+${date}.wav`;
    const reference = storage().ref(filename);
    try {
      await reference.putFile(audioPath, { contentType: "audio/wav" });
      navigation.navigate("AnalysisScreen", {
        filename,
        acc_id: currentUser.uid,
        type: isPublicSpeaking,
      });
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
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    margin: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  recording: {
    backgroundColor: "#f44336", // Red color for recording
  },
  notRecording: {
    backgroundColor: "#4CAF50", // Green color for not recording
  },
  playing: {
    backgroundColor: "#FF9800", // Orange color for playing
  },
  notPlaying: {
    backgroundColor: "#2196F3", // Blue color for not playing
  },
  upload: {
    backgroundColor: "#9C27B0", // Purple color for uploading
  },
});

export default AudioRecorder;
