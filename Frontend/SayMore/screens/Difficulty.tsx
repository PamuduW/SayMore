import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const Difficulty: React.FC = ({ navigation }: any) => {
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
      </ImageBackground>

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
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
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
