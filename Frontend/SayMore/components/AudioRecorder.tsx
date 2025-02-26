import React, { useState, useEffect } from "react";
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
} from "react-native";
import AudioRecord from "react-native-audio-record";
import Sound from "react-native-sound";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { request, PERMISSIONS } from "react-native-permissions";

interface AudioRecorderProps {
  isPublicSpeaking: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ isPublicSpeaking }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

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
    const filename = `recordings/${folder}/${currentUser.uid}_${date}.wav`;
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
    <ImageBackground
      source={require("../assets/recordScreen.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Audio Recorder</Text>

        {/* Recording button */}
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[
            styles.recordingButton,
            isRecording ? styles.recording : styles.notRecording,
          ]}
        >
          <Image
            source={require("../assets/mic.png")}
            style={styles.recordingIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={sound ? stopAudio : playAudio}
          style={[styles.button, sound ? styles.playing : styles.notPlaying]}
        >
          <Text style={styles.buttonText}>{sound ? "Stop Playback" : "Play Audio"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={uploadAudio} style={[styles.button, styles.upload]}>
          <Text style={styles.buttonText}>Upload to Firebase</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // White text for better contrast
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
  recordingButton: {
    width: 80, // Same size as the icon
    height: 80, // Same size as the icon
    borderRadius: 40, // Circular background
    justifyContent: "center",
    alignItems: "center",
  },
  recordingIcon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  recording: {
    backgroundColor: "#f44336",
  },
  notRecording: {
    backgroundColor: "#2196F3",
  },
  playing: {
    backgroundColor: "#FF9800",
  },
  notPlaying: {
    backgroundColor: "#2196F3",
  },
  upload: {
    backgroundColor: "#9C27B0",
  },
});

export default AudioRecorder;
