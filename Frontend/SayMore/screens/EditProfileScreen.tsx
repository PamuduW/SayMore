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
import { useTheme } from '../components/ThemeContext';

export default function EditProfileScreen({ navigation }) {
  const [fname, setFname] = useState('');
  const [sname, setSname] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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

            // Format only date part (YYYY-MM-DD)
            if (data.dob) {
              const formattedDate = data.dob.split('T')[0];
              setDob(formattedDate);
            } else {
              setDob('');
            }

            setUsername(data.username || '');
            setEmail(currentUser.email); // Set email from Firebase Auth
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
      if (currentUser) {
        await firestore()
          .collection('User_Accounts')
          .doc(currentUser.uid)
          .update({
            fname,
            sname,
            dob,
            username,
          });

        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme === 'dark' ? '#FFFFFF' : '#2A2D57'} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#3A3A3A', '#3A3A3A'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={[styles.header, theme === 'dark' && styles.darkHeader]}>Edit Profile</Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, theme === 'dark' && styles.darkLabel]}>Name</Text>
          <TextInput
            style={[styles.input, theme === 'dark' && styles.darkInput]}
            value={fname}
            onChangeText={setFname}
            placeholder="Enter Name"
            placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          />

          <Text style={[styles.label, theme === 'dark' && styles.darkLabel]}>Surname</Text>
          <TextInput
            style={[styles.input, theme === 'dark' && styles.darkInput]}
            value={sname}
            onChangeText={setSname}
            placeholder="Enter Surname"
            placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          />

          <Text style={[styles.label, theme === 'dark' && styles.darkLabel]}>Date of Birth</Text>
          <TextInput
            style={[styles.input, theme === 'dark' && styles.darkInput]}
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          />

          <Text style={[styles.label, theme === 'dark' && styles.darkLabel]}>Username</Text>
          <TextInput
            style={[styles.input, theme === 'dark' && styles.darkInput]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter Username"
            placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          />

          <Text style={[styles.label, theme === 'dark' && styles.darkLabel]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme === 'dark' ? '#555' : '#D0D3E6', color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
            ]}
            value={email}
            editable={false}
          />
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity onPress={handleSave} style={{ marginBottom: 15 }}>
          <LinearGradient
            colors={
              theme === 'dark' ? ['#2B2B2B', '#3A3A3A'] : ['#577BC1', '#577BC1']
            }
            style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cancel Changes Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 15 }}>
          <LinearGradient colors={['#e74c3c', '#ff6b6b']} style={styles.button}>
            <Text style={styles.buttonText}>Cancel Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Change Password Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ChangePasswordScreen')}>
          <LinearGradient colors={['#FFA500', '#FFB347']} style={styles.button}>
            <Text style={styles.buttonText}>Change Password</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  scrollArea: { paddingHorizontal: 20, paddingBottom: 40 },

  header: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  darkHeader: {
    color: '#FFFFFF',
  },

  inputContainer: { marginBottom: 20 },

  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
  },

  darkLabel: {
    color: '#FFFFFF',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    color: '#2A2D57',
  },

  darkInput: {
    backgroundColor: '#555',
    color: '#FFFFFF',
  },

  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
  },

  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});