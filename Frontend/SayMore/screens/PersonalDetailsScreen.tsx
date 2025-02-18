import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../components/Authentication";

const PersonalDetailsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");

  const handleSave = async () => {
    if (!fname || !sname || !username || !age) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await firestore()
        .collection("User_Accounts")
        .doc(user.uid)
        .update({
          fname,
          sname,
          username,
          age: parseInt(age),
          profileComplete: true,
        });

      Alert.alert("Success", "Profile updated successfully!");

      // Navigate back to LandingPage (which now listens for updates)
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <TextInput style={styles.input} placeholder="First Name" value={fname} onChangeText={setFname} />
      <TextInput style={styles.input} placeholder="Surname" value={sname} onChangeText={setSname} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F0F8FF" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: "#87CEEB", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#003366", fontWeight: "bold" },
});

export default PersonalDetailsScreen;
