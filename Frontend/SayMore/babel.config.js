/**
 * Babel configuration for React Native
 * @type {Object}
 * @property {Array<string>} presets - List of Babel presets
 * @property {Array<string>} plugins - List of Babel plugins
 */
module.exports = {
  // Use the React Native Babel preset
  presets: ['module:@react-native/babel-preset'],
  // Use the React Native Reanimated plugin
  plugins: ['react-native-reanimated/plugin'],
};