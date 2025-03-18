import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

export default function EditProfileScreen({ navigation }) {
  const [fname, setFname] = useState('');
  const [sname, setSname] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDoc = await firestore()
            .collection('User_Accounts')
            .doc(currentUser.uid)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            setFname(data.fname || '');
            setSname(data.sname || '');
            setDob(data.dob || '');
            setEmail(data.email || '');
            setOriginalEmail(data.email || '');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      // Check if email is being changed
      if (email !== originalEmail) {
        if (!currentPassword) {
          Alert.alert('Error', 'Enter your current password to change email!');
          return;
        }

        // 🔐 Re-authenticate
        const credential = auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
        await currentUser.reauthenticateWithCredential(credential);

        // Update email
        await currentUser.updateEmail(email);

        // Optionally: Send verification
        await currentUser.sendEmailVerification();

        Alert.alert('Verification Sent', 'A verification email has been sent to your new email. Please verify.');

        // Update Firestore after email update
        await firestore().collection('User_Accounts').doc(currentUser.uid).update({
          fname,
          sname,
          dob,
          email,
        });

        setOriginalEmail(email); // Update locally too
        navigation.goBack();
        return;
      }

      // No email change, update other fields
      await firestore().collection('User_Accounts').doc(currentUser.uid).update({
        fname,
        sname,
        dob,
        email,
      });

      Alert.alert('Success', 'Profile updated!');
      navigation.goBack();

    } catch (error) {
      console.log(error);
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Session Expired', 'Please sign in again to update your email.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A2D57" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#2A2D57', '#577BC1']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={styles.header}>Edit Profile</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={fname}
            onChangeText={setFname}
            placeholder="Enter Name"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            value={sname}
            onChangeText={setSname}
            placeholder="Enter Surname"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
          />

          {email !== originalEmail && (
            <>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter Current Password"
                placeholderTextColor="#aaa"
                secureTextEntry
              />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => navigation.navigate('ChangePasswordScreen')}>
          <Text style={styles.passwordText}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  scrollArea: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { fontSize: 26, color: '#fff', marginBottom: 30, textAlign: 'center', fontWeight: 'bold' },
  inputContainer: { marginBottom: 20 },
  label: { color: '#FFFFFF', marginBottom: 8, fontSize: 15, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    color: '#2A2D57',
  },
  saveButton: {
    backgroundColor: '#3B5998',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  passwordButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  passwordText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
