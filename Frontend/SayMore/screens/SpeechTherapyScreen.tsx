import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View
      style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      {/* Header with Back Button */}
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

        <Text
          style={[
            styles.headerTitle,
            theme === 'dark' ? styles.headerTitleDark : styles.headerTitleLight,
          ]}>
          Speech Therapists
        </Text>

        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        {therapists.map(item => (
          <View
            style={[
              styles.card,
              theme === 'dark' ? styles.cardDark : styles.cardLight,
            ]}
            key={item.id}>
            <Text
              style={[
                styles.name,
                theme === 'dark' ? styles.textWhite : styles.textDark,
              ]}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.details,
                theme === 'dark' ? styles.textGrey : styles.textDark,
              ]}>
              📍 {item.location}
            </Text>
            <TouchableOpacity onPress={() => handleCall(item.contact)}>
              <Text
                style={[
                  styles.contact,
                  theme === 'dark' ? styles.textWhite : styles.textDark,
                ]}>
                📞 {item.contact}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEmail(item.email)}>
              <Text
                style={[
                  styles.contact,
                  theme === 'dark' ? styles.textWhite : styles.textDark,
                ]}>
                ✉ {item.email}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  darkContainer: { flex: 1, backgroundColor: '#121212', padding: 20 },
  lightContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },

  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitleLight: {
    color: '#003366',
  },
  headerTitleDark: {
    color: '#FFFFFF',
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
    paddingBottom: 2,
    lineHeight: 32,
  },
  backButtonTextDark: {
    color: '#000',
  },

  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardLight: {
    backgroundColor: '#E6F7FF',
  },
  cardDark: {
    backgroundColor: '#1C1C1C',
  },

  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  details: { fontSize: 14, marginBottom: 5 },
  contact: { fontSize: 14, marginTop: 5 },

  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#003366' },
  textGrey: { color: '#AAAAAA' },
});

export default SpeechTherapyScreen;
