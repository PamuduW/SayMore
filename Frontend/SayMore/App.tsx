import React from 'react';
import { View, StyleSheet } from 'react-native';
import Landing from './components/LandingPage';
import { ThemeProvider, useTheme } from './components/ThemeContext';

/**
 * The main application component wrapped with ThemeProvider.
 * @returns {JSX.Element} The main application component.
 */
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

/**
 * The main application component that uses the current theme.
 * @returns {JSX.Element} The main application component with theme-based styling.
 */
const MainApp: React.FC = () => {
  const theme = useTheme();

  return (
    <View
      style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <Landing />
    </View>
  );
};

/**
 * Styles for the application containers.
 */
const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: '#000000'
  },
  lightContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
});