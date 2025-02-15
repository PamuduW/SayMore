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
import firestore from "@react-native-firebase/firestore";

/**
 * SignUpScreen component.
 * Allows users to sign up using email/password or Google Sign-In.
 *
 * @returns {JSX.Element} The rendered SignUpScreen component.
 */
export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "290999401549-28sv0ta1mhh68drtsi40nr5vmlvnpoa6.apps.googleusercontent.com",
    });
  }, []);

  /**
   * Handles the sign-up process using email and password.
   * Displays an alert if fields are empty, passwords do not match, or if there is an error during sign-up.
   */
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await user.sendEmailVerification();

      await firestore().collection("User_Accounts").doc(user.uid).set({
        email: user.email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert(
        "Success",
        "Account created successfully! Please check your email for verification.",
      );
    } catch (error) {
      const errorMessage =
        {
          "auth/email-already-in-use":
            "This email address is already registered. Please log in or use Google login.",
          "auth/invalid-email": "Please enter a valid email address",
          "auth/weak-password": "Password is too weak",
        }[error.code] || error.message;
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the Google Sign-In process.
   * Displays an alert if there is an error during Google Sign-In.
   */
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      const userDoc = await firestore().collection("User_Accounts").doc(user.uid).get();

      if (!userDoc.exists) {
        await firestore().collection("User_Accounts").doc(user.uid).set({
          email: user.email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      Alert.alert("Success", "Account created successfully!");
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join now to begin your journey with us</Text>

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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
          </TouchableOpacity>
          <Text style={styles.Text}>OR</Text>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Image source={require("../assets/google-icon.png")} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </TouchableOpacity>
          <Text style={styles.LongText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.linkText}>Sign In</Text>
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
  buttonDisabled: {
    backgroundColor: "#cccccc",
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
