import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

/**
 * ChangePasswordScreen component that allows users to change their password.
 * @param {Object} props - The properties for the component.
 * @param {Object} props.navigation - The navigation object for navigating between screens.
 * @returns {JSX.Element} The rendered component.
 */
export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const theme = useTheme();

  /**
   * Reauthenticates the user with the provided password.
   * @param {string} password - The current password of the user.
   * @returns {Promise<void>} A promise that resolves when the user is reauthenticated.
   */
  const reauthenticate = async password => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(user.email, password);
    return await user.reauthenticateWithCredential(credential);
  };

  /**
   * Handles the password change process.
   * Validates the new password and updates it if valid.
   */
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match!');
      return;
    }
    try {
      await reauthenticate(currentPassword);
      await auth().currentUser.updatePassword(newPassword);
      Alert.alert('Success', 'Password updated successfully!');
      navigation.goBack(); // Go back to Edit Profile
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']
      }
      style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            theme === 'dark' ? styles.backButtonDark : styles.backButtonLight,
          ]}>
          <Text
            style={[
              styles.backButtonText,
              theme === 'dark' && styles.backButtonTextDark,
            ]}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Change Password</Text>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.labelColor]}>Current Password</Text>
        <TextInput
          style={[
            styles.input,
            theme === 'dark' ? styles.inputDark : styles.inputLight,
          ]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter Current Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <Text style={[styles.label, styles.labelColor]}>New Password</Text>
        <TextInput
          style={[
            styles.input,
            theme === 'dark' ? styles.inputDark : styles.inputLight,
          ]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter New Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <Text style={[styles.label, styles.labelColor]}>Confirm Password</Text>
        <TextInput
          style={[
            styles.input,
            theme === 'dark' ? styles.inputDark : styles.inputLight,
          ]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        onPress={handleChangePassword}
        style={styles.confirmButtonContainer}>
        <LinearGradient
          colors={
            theme === 'dark' ? ['#3A3A3A', '#4A4A4A'] : ['#00C6FF', '#0072FF']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },

  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },

  placeholder: { width: 48 }, // For spacing balance

  inputContainer: { marginBottom: 20 },

  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
  },

  labelColor: {
    color: '#FFFFFF',
  },

  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },

  inputDark: {
    backgroundColor: '#2B2B2B',
    color: '#FFFFFF',
  },

  inputLight: {
    backgroundColor: '#FFFFFF',
    color: '#2A2D57',
  },

  confirmButtonContainer: {
    marginTop: 20,
  },

  confirmButton: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 8,
  },

  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  backButtonLight: {
    backgroundColor: '#E6F7FF',
  },
  backButtonDark: {
    backgroundColor: '#FFF',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    includeFontPadding: false,
    paddingBottom: 2,
    lineHeight: 32,
  },
  backButtonTextDark: {
    color: '#000',
  },
});