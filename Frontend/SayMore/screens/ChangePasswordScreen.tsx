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
import { useTheme } from '../components/ThemeContext'; // Import useTheme

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const theme = useTheme(); // Detect theme

  const reauthenticate = async password => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(user.email, password);
    return await user.reauthenticateWithCredential(credential);
  };

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
        theme === 'dark'
          ? ['#1C1C1C', '#3A3A3A']
          : ['#2A2D57', '#577BC1']
      }
      style={styles.container}>
      <Text
        style={[
          styles.header,
          { color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' },
        ]}>
        Change Password
      </Text>

      <View style={styles.inputContainer}>
        <Text
          style={[
            styles.label,
            { color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' },
          ]}>
          Current Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme === 'dark' ? '#2B2B2B' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
            },
          ]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter Current Password"
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#aaa'}
          secureTextEntry
        />

        <Text
          style={[
            styles.label,
            { color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' },
          ]}>
          New Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme === 'dark' ? '#2B2B2B' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
            },
          ]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter New Password"
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#aaa'}
          secureTextEntry
        />

        <Text
          style={[
            styles.label,
            { color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' },
          ]}>
          Confirm Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme === 'dark' ? '#2B2B2B' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
            },
          ]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#aaa'}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        onPress={handleChangePassword}
        style={{ marginTop: 20 }}>
        <LinearGradient
          colors={
            theme === 'dark'
              ? ['#3A3A3A', '#4A4A4A']
              : ['#00C6FF', '#0072FF']
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
  header: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  inputContainer: { marginBottom: 20 },

  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
  },

  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },

  confirmButton: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 8,
  },

  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
