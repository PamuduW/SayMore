import React from 'react';
import { View, StyleSheet } from 'react-native';
import Landing from './components/LandingPage';
import { ThemeProvider, useTheme } from './components/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const MainApp: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <Landing />
    </View>
  );
};

const styles = StyleSheet.create({
  darkContainer: { flex: 1, backgroundColor: '#000000' },
  lightContainer: { flex: 1, backgroundColor: '#FFFFFF' },
});