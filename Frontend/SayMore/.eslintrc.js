/**
 * ESLint configuration file
 * @type {Object}
 * @property {boolean} root - Indicates if this is the root configuration.
 * @property {Array<string>} extends - List of configurations to extend.
 * @property {Array<string>} plugins - List of ESLint plugins.
 * @property {Object} rules - Custom ESLint rules.
 */
module.exports = {
  root: true,
  extends: [
    '@react-native-community', // React Native's recommended ESLint config
    'prettier', // Disables ESLint rules that conflict with Prettier
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Shows Prettier issues as ESLint errors
    'no-unused-vars': 'warn', // Warn for unused variables instead of error
    'no-console': 'warn', // Warn instead of error for console logs
    'react/react-in-jsx-scope': 'off', // Not needed in React Native
    'react-native/no-inline-styles': 'warn', // Warn against inline styles
    'react-hooks/exhaustive-deps': 'warn', // Catch missing dependencies in useEffect
    'jsx-quotes': ['error', 'prefer-double'], // Enforce double quotes in JSX
  },
};
