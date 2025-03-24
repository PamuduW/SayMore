import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

/**
 * Context to provide the current theme ('light' or 'dark').
 */
const ThemeContext = createContext('light');

/**
 * ThemeProvider component that uses the current color scheme and provides it to its children.
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The ThemeContext provider with the current theme.
 */
export const ThemeProvider: React.FC = ({ children }) => {
  const theme = useColorScheme();
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the current theme context.
 * @returns {string} The current theme ('light' or 'dark').
 */
export const useTheme = () => useContext(ThemeContext);