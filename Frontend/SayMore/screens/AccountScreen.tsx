import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

/**
 * AccountScreen component.
 * Displays user account information and provides sign-out functionality.
 */
export default function AccountScreen() {
  /**
   * Handles the sign-out process.
   * Signs out from Google and Firebase authentication.
   */
  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (googleError) {
      console.log("Google sign out error:", googleError);
    }
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert("Error", "An error occurred while signing out. Please try again.");
    }
  };

  /**
   * Confirms the sign-out action with the user.
   * Displays an alert dialog to confirm the sign-out.
   */
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
            style={item === "Progress" ? styles.menuItemActive : styles.menuItem}>
            <Text style={item === "Progress" ? styles.menuTextActive : styles.menuText}>{item}</Text>
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
  logoutButton: { marginTop: 20 },
  logoutText: { fontSize: 16, color: "#FF0000" },
});
