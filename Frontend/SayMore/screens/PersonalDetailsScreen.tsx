import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/Authentication';

const PersonalDetailsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [fname, setFname] = useState('');
  const [sname, setSname] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(!fname || !sname || !username || !dob);
  }, [fname, sname, username, dob]);

  const handleSave = async () => {
    if (!fname || !sname || !username || !dob) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await firestore()
        .collection('User_Accounts')
        .doc(user.uid)
        .set(
          {
            fname,
            sname,
            username,
            dob: dob.toISOString(),
            profileComplete: true,
            watchedVideos: [],
            results: {
              PS_Check: firestore.FieldValue.arrayUnion(''),
              Stuttering_Check: firestore.FieldValue.arrayUnion(''),
            },
          },
          { merge: true }
        );

      Alert.alert('Success', 'Profile updated successfully!');

      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <TextInput
        key="fname"
        style={styles.input}
        placeholder="First Name"
        value={fname}
        onChangeText={setFname}
        placeholderTextColor="#999"
      />
      <TextInput
        key="sname"
        style={styles.input}
        placeholder="Surname"
        value={sname}
        onChangeText={setSname}
        placeholderTextColor="#999"
      />
      <TextInput
        key="username"
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}>
        <Text style={dob ? styles.dobText : styles.placeholderText}>
          {dob ? dob.toDateString() : 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isButtonDisabled}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#B0E0E6',
  },
  buttonText: { color: '#003366', fontWeight: 'bold' },
  dobText: { color: 'black' },
  placeholderText: { color: '#999' },
});

export default PersonalDetailsScreen;
