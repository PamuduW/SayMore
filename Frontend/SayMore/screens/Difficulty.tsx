import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

/**
 * Difficulty component that allows users to select a difficulty level for public speaking questions.
 * @param {Object} props - The properties for the component.
 * @param {Object} props.navigation - The navigation object for navigating between screens.
 * @returns {JSX.Element} The rendered component.
 */
const Difficulty: React.FC = ({ navigation }: any) => {
  /**
   * Handles the selection of a difficulty level.
   * @param {string} level - The selected difficulty level.
   */
  const handleSelection = (level: string) => {
    navigation.navigate('PublicSpeakQuestionScreen', { difficulty: level });
  };

  return (
    <View style={styles.background}>
      <ImageBackground
        source={require('../assets/dif.jpg')}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.overlay} />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.header}>Select Difficulty</Text>

          <TouchableOpacity
            style={[styles.optionButton, styles.easy]}
            onPress={() => handleSelection('Easy')}>
            <Text style={styles.optionText}>Easy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.intermediate]}
            onPress={() => handleSelection('Intermediate')}>
            <Text style={styles.optionText}>Intermediate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.hard]}
            onPress={() => handleSelection('Hard')}>
            <Text style={styles.optionText}>Hard</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  image: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30 },

  optionButton: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  easy: { backgroundColor: '#2ecc71' },
  intermediate: { backgroundColor: '#f1c40f' },
  hard: { backgroundColor: '#e74c3c' },
  optionText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default Difficulty;