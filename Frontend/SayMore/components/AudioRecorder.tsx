import React, { useState } from "react";
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, Alert } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import storage from "@react-native-firebase/storage";
import RNFS from "react-native-fs";
import { v4 as uuidv4 } from "uuid";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const navigation = useNavigation();

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission denied", "Cannot record audio without permission.");
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    if (await requestPermissions()) {
      const path = `${RNFS.DocumentDirectoryPath}/recordedAudio.wav`;
      await audioRecorderPlayer.startRecorder(path);
      setIsRecording(true);
      setAudioPath(path);
    }
  };

  const stopRecording = async () => {
    setAudioPath(await audioRecorderPlayer.stopRecorder());
    setIsRecording(false);
  };

  const startPlayback = async () => {
    if (audioPath) {
      await audioRecorderPlayer.startPlayer(audioPath);
      const playbackListener = audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          stopPlayback();
          audioRecorderPlayer.removePlayBackListener(playbackListener);
        }
      });
      setIsPlaying(true);
    }
  };

  const stopPlayback = async () => {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(false);
  };

  const uploadAudio = async () => {
    if (audioPath) {
      const currentUser = auth().currentUser;
      const acc_id = currentUser.uid;
      const file_id = new Date().toISOString();
      const filename = `recordings/${acc_id}+${file_id}.wav`;
      const reference = storage().ref(filename);
      try {
        await reference.putFile(audioPath);
        navigation.navigate("AnalysisScreen", { filename, acc_id });
      } catch (error) {
        Alert.alert("Upload Failed", error.message);
      }
    } else {
      Alert.alert("No Audio", "Please record audio before uploading.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Audio Recorder</Text>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={{ backgroundColor: isRecording ? "red" : "green", padding: 10, margin: 10 }}>
        <Text style={{ color: "white" }}>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={isPlaying ? stopPlayback : startPlayback}
        style={{ backgroundColor: isPlaying ? "orange" : "blue", padding: 10, margin: 10 }}>
        <Text style={{ color: "white" }}>{isPlaying ? "Stop Playback" : "Play Audio"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={uploadAudio}
        style={{ backgroundColor: "purple", padding: 10, margin: 10 }}>
        <Text style={{ color: "white" }}>Upload to Firebase</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AudioRecorder;
