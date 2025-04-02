import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

/**
 * Context to provide the current theme ('light' or 'dark').
 */
const ThemeContext = createContext();

/**
 * ThemeProvider component that uses the current color scheme and provides it to its children.
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The ThemeContext provider with the current theme and toggle function.
 */
export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the current theme context.
 * @returns {Object} The current theme ('light' or 'dark') and the toggle function.
 */
export const useTheme = () => useContext(ThemeContext);
