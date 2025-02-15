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

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    } else {
      await request(PERMISSIONS.IOS.MICROPHONE);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    AudioRecord.start();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const path = await AudioRecord.stop();
    setAudioPath(path);
  };

  const playAudio = async () => {
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
    if (sound) {
      sound.stop(() => setSound(null));
    }
  };

  const uploadAudio = async () => {
    if (audioPath) {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      const acc_id = currentUser.uid;
      const file_id = new Date().toISOString();
      const filename = `recordings/${acc_id}+${file_id}.wav`;
      const reference = storage().ref(filename);
      try {
        await reference.putFile(audioPath, { contentType: "audio/wav" });
        navigation.navigate("AnalysisScreen", { filename, acc_id });
      } catch (error) {
        Alert.alert("Upload Failed", error.message);
      }
    } else {
      Alert.alert("No Audio", "Please record audio before uploading.");
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
