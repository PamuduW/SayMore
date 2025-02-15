import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "290999401549-28sv0ta1mhh68drtsi40nr5vmlvnpoa6.apps.googleusercontent.com",
    });
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);

      if (!userCredential.user.emailVerified) {
        Alert.alert("Email Not Verified", "Please verify your email before signing in.", [
          { text: "OK" },
          {
            text: "Resend Email",
            onPress: () => userCredential.user.sendEmailVerification(),
          },
        ]);
        await auth().signOut();
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Login Error",
          "Username or password is incorrect. Please check your credentials and try again.",
        );
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const signInResult = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      Alert.alert("Authentication Error", error.message || "An error occurred during Google Sign In");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log In and continue your learning</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <Text style={styles.Text}>OR</Text>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Image source={require("../assets/google-icon.png")} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
          <Text style={styles.LongText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    padding: 20,
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#87CEEB",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  buttonText: {
    color: "#003366",
    fontSize: 16,
    fontWeight: "bold",
  },
  Text: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  LongText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  linkText: {
    color: "#003366",
    textAlign: "center",
  },
});
