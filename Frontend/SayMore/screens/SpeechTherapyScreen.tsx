import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext';

const therapists = [
  {
    id: '1',
    name: 'Dr. Amanda Smith',
    contact: '+94 77 123 4567',
    email: 'amanda.smith@speechclinic.com',
    location: 'Colombo, Sri Lanka',
  },
  {
    id: '2',
    name: 'Mr. Ruwan Perera',
    contact: '+94 71 987 6543',
    email: 'ruwan.perera@therapycenter.com',
    location: 'Kandy, Sri Lanka',
  },
  {
    id: '3',
    name: 'Ms. Sarah Fernando',
    contact: '+94 76 555 7890',
    email: 'sarah.fernando@speechhelp.org',
    location: 'Galle, Sri Lanka',
  },
];

const SpeechTherapyScreen = () => {
  const theme = useTheme();

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <Text style={styles.header}>Speech Therapists</Text>
      <FlatList
        data={therapists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>📍 {item.location}</Text>
            <TouchableOpacity onPress={() => handleCall(item.contact)}>
              <Text style={styles.contact}>📞 {item.contact}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEmail(item.email)}>
              <Text style={styles.contact}>✉️ {item.email}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  darkContainer: { flex: 1, backgroundColor: '#121212', padding: 20 },
  lightContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#003366',
  },
  card: {
    backgroundColor: '#E6F7FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  details: { fontSize: 14, color: '#666' },
  contact: { fontSize: 14, color: '#003366', marginTop: 5 },
});

export default SpeechTherapyScreen;

