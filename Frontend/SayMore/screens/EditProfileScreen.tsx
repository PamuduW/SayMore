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
            if (data.dob) {
              const formattedDate = data.dob.split('T')[0];
              setDob(formattedDate);
            } else {
              setDob('');
            }
            setUsername(data.username || '');
            setEmail(currentUser.email);
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
        <ActivityIndicator size="large" color="#2A2D57" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#2A2D57', '#577BC1']
      }
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollArea}>

        {/* Header with Back Button & Title */}
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

          <Text style={styles.headerTitle}>Edit Profile</Text>

          {/* Empty placeholder View for spacing */}
          <View style={styles.placeholder} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: '#FFFFFF' }]}>Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === 'dark' ? '#2B2B2B' : '#FFFFFF',
                color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
              },
            ]}
            value={fname}
            onChangeText={setFname}
            placeholder="Enter Name"
            placeholderTextColor="#aaa"
          />

          <Text style={[styles.label, { color: '#FFFFFF' }]}>Surname</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === 'dark' ? '#2B2B2B' : '#FFFFFF',
                color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
              },
            ]}
            value={sname}
            onChangeText={setSname}
            placeholder="Enter Surname"
            placeholderTextColor="#aaa"
          />

          <Text style={[styles.label, { color: '#FFFFFF' }]}>Date of Birth</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === 'dark' ? '#2B2B2B' : '#FFFFFF',
                color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
              },
            ]}
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#aaa"
          />

          <Text style={[styles.label, { color: '#FFFFFF' }]}>Username</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === 'dark' ? '#2B2B2B' : '#FFFFFF',
                color: theme === 'dark' ? '#FFFFFF' : '#2A2D57',
              },
            ]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter Username"
            placeholderTextColor="#aaa"
          />

          <Text style={[styles.label, { color: '#FFFFFF' }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === 'dark' ? '#1E1E1E' : '#D0D3E6',
                color: theme === 'dark' ? '#999999' : '#2A2D57'
              },
            ]}
            value={email}
            editable={false}
          />
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity onPress={handleSave} style={{ marginBottom: 15 }}>
          <LinearGradient
            colors={
              theme === 'dark' ? ['#3A3A3A', '#4A4A4A'] : ['#00C6FF', '#0072FF']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cancel Changes Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 15 }}>
          <LinearGradient
            colors={['#e74c3c', '#ff6b6b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}>
            <Text style={styles.buttonText}>Cancel Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Change Password Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ChangePasswordScreen')}>
          <LinearGradient
            colors={['#FFA500', '#FFB347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}>
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

  placeholder: { width: 48 }, // For spacing on right side

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

  button: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 8,
  },

  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

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