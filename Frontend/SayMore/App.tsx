import React from 'react';
import { useColorScheme, View, StyleSheet } from 'react-native';
import Landing from './components/LandingPage';

export default function App() {
  const theme = useColorScheme(); // Detect system theme

  return (
    <View style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <Landing />
    </View>
  );
}

const styles = StyleSheet.create({
  darkContainer: { flex: 1, backgroundColor: '#000000' },
  lightContainer: { flex: 1, backgroundColor: '#FFFFFF' },
});
