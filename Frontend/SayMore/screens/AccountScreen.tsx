import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function AccountScreen() {
  const handleSignOut = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          await GoogleSignin.signOut();
        } catch (googleError) {
          console.log("Google sign out error:", googleError);
        }
        await auth().signOut();
      }
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert(
        "Error",
        "An error occurred while signing out. Please try again.",
      );
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", onPress: handleSignOut, style: "destructive" },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Image source={require("../assets/avatar.png")} style={styles.avatar} />
        <Text style={styles.username}>Aria Davis</Text>
        {[
          "Activity",
          "Quizzes and Challenges",
          "Progress",
          "Points",
          "Leaderboard",
          "Speech Therapy",
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={
              item === "Progress" ? styles.menuItemActive : styles.menuItem
            }>
            <Text
              style={
                item === "Progress" ? styles.menuTextActive : styles.menuText
              }>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmSignOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: "75%",
    height: "100%",
    backgroundColor: "#BDE0FE",
    padding: 20,
    alignItems: "flex-start",
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
  },
  menuItem: { paddingVertical: 10 },
  menuText: { fontSize: 16, color: "#003366" },
  menuItemActive: {
    paddingVertical: 10,
    backgroundColor: "#0080FF",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  menuTextActive: { fontSize: 16, color: "#FFFFFF" },
  logoutButton: { marginTop: 20, flexDirection: "row", alignItems: "center" },
  logoutText: { fontSize: 16, color: "#FF0000" },
});
