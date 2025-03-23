import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

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
  {
    id: '4',
    name: 'Dr. Nimal Jayawardena',
    contact: '+94 78 123 9876',
    email: 'nimal.jayawardena@sltherapists.com',
    location: 'Negombo, Sri Lanka',
  },
  {
    id: '5',
    name: 'Ms. Priya Kumari',
    contact: '+94 72 987 2345',
    email: 'priya.kumari@voicespeech.com',
    location: 'Matara, Sri Lanka',
  },
  {
    id: '6',
    name: 'Mr. Saman Perera',
    contact: '+94 75 555 1234',
    email: 'saman.perera@therapyhub.lk',
    location: 'Kurunegala, Sri Lanka',
  },
];

const SpeechTherapyScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const borderAnimation = new Animated.Value(0);

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  // Animation loop for border effect
  Animated.loop(
    Animated.timing(borderAnimation, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    })
  ).start();

  const borderInterpolation = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2D336B', '#7886C7'],
  });

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, theme === 'dark' ? styles.backButtonDark : styles.backButtonLight]}
        >
          <Text style={[styles.backButtonText, theme === 'dark' && styles.backButtonTextDark]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, theme === 'dark' ? styles.headerTitleDark : styles.headerTitleLight]}>
          Speech Therapists
        </Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Therapist List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {therapists.map(item => (
          <View
            key={item.id}
            style={[styles.card, theme === 'dark' ? styles.cardDark : styles.cardLight]}
          >
            <Text style={[styles.name, theme === 'dark' ? styles.textWhite : styles.textDark]}>{item.name}</Text>
            <Text style={[styles.details, theme === 'dark' ? styles.textGrey : styles.textDark]}>
              📍 {item.location}
            </Text>
            <TouchableOpacity onPress={() => handleCall(item.contact)}>
              <Text style={[styles.contact, theme === 'dark' ? styles.textWhite : styles.textDark]}>
                📞 {item.contact}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEmail(item.email)}>
              <Text style={[styles.contact, theme === 'dark' ? styles.textWhite : styles.textDark]}>
                ✉ {item.email}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backButtonLight: { backgroundColor: '#E6F7FF' },
  backButtonDark: { backgroundColor: '#FFF' },
  backButtonText: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center' },
  backButtonTextDark: { color: '#000' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: 0.5 },
  headerTitleLight: { color: '#003366' },
  headerTitleDark: { color: '#FFFFFF' },

  scrollContainer: { paddingTop: 10 },
  card: { padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  cardLight: { backgroundColor: '#E6F7FF' },
  cardDark: { backgroundColor: '#1C1C1C' },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  details: { fontSize: 14, marginBottom: 8 },
  contact: { fontSize: 14, marginTop: 8 },

  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#003366' },
  textGrey: { color: '#AAAAAA' },
});

export default SpeechTherapyScreen;