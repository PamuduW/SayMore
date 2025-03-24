/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Custom Metro configuration
 * @type {Object}
 * @property {Object} transformer - Transformer configuration
 * @property {string} transformer.babelTransformerPath - Path to the custom Babel transformer
 * @property {Object} resolver - Resolver configuration
 * @property {Array<string>} resolver.assetExts - List of asset extensions to be resolved
 * @property {Array<string>} resolver.sourceExts - List of source extensions to be resolved
 */
const config = {
  transformer: {
    // Use 'react-native-svg-transformer' for transforming SVG files
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Exclude 'svg' from asset extensions
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(
      ext => ext !== 'svg'
    ),
    // Include 'svg' in source extensions
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
  },
};

// Merge the custom configuration with the default configuration
module.exports = mergeConfig(getDefaultConfig(__dirname), config);