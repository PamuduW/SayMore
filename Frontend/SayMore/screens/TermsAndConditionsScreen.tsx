import React from "react";
  import { View, Text, ScrollView, StyleSheet, Button } from "react-native";

  const TermsAndConditionsScreen = ({ navigation }) => {
    const handleAccept = () => {
      console.log("Accepted");
    };

    return (

      <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.date}>Last Updated 16/02/2025 </Text>
        <ScrollView style={styles.scrollView}>

          <Text style={styles.text}>
            By using SayMore, you agree to the following:
            {"\n\n"}
            1. Account Information: Provide accurate and truthful personal information during registration and ensure your account remains secure.
            {"\n\n"}
            2. App Usage: Use the app solely for personal speech improvement and not as a substitute for professional therapy, diagnosis, or advice.
            {"\n\n"}
            3. Data Usage: Allow secure processing of your data, such as audio recordings and progress metrics, for personalized feedback and service improvement. Your data will be handled in accordance with our Privacy Policy.
            {"\n\n"}
            4. Prohibited Actions: Refrain from misuse of the app, including sharing inappropriate, offensive, or harmful content, attempting unauthorized access, or using the app for commercial purposes.
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Go Back" onPress={() => navigation.navigate("MoreScreen")} />
          </View>
        </ScrollView>
      </View>
    );
  };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    padding: 20,
  },
  scrollView: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 0,
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 15,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});;