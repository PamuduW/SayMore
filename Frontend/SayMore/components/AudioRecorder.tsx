import React, { useState } from "react";
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, Alert } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import storage from "@react-native-firebase/storage";
import RNFS from "react-native-fs";

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission denied", "Cannot record audio without permission.");
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const path = `${RNFS.DocumentDirectoryPath}/recordedAudio.wav`;
    await audioRecorderPlayer.startRecorder(path);
    setIsRecording(true);
    setAudioPath(path);
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setIsRecording(false);
    setAudioPath(result);
  };

  const startPlayback = async () => {
    if (!audioPath) return;

    await audioRecorderPlayer.startPlayer(audioPath);
    setIsPlaying(true);
  };

  const stopPlayback = async () => {
    await audioRecorderPlayer.stopPlayer();
    setIsPlaying(false);
  };

  const uploadAudio = async () => {
    if (!audioPath) {
      Alert.alert("No Audio", "Please record audio before uploading.");
      return;
    }

    const filename = `audio_${Date.now()}.wav`;
    const reference = storage().ref(`recordings/${filename}`);

    try {
      await reference.putFile(audioPath);
      Alert.alert("Upload Success", "Audio uploaded successfully!");
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
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