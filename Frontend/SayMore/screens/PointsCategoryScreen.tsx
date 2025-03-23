import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';

const PointsCategoryScreen: React.FC = ({ navigation }: any) => {
  const theme = useTheme();

  const handlePress = (title: string) => {
    if (title === 'Lessons Points') {
      navigation.navigate('TotalPointsScreen');
    } else if (title === 'Quizzes & Challenges Points') {
      navigation.navigate('QuizPointHistoryScreen');
    }
  };

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#000000', '#121212'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme === 'dark' ? '#000' : '#577BC1'}
      />
      <SafeAreaView style={styles.safeArea}>
        <Text
          style={[
            styles.header,
            { color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' },
          ]}>
          Choose Points Category
        </Text>

        <TouchableOpacity
          style={[
            styles.optionButton,
            { backgroundColor: theme === 'dark' ? '#3A3A3A' : '#FFFFFF' },
          ]}
          onPress={() => handlePress('Lessons Points')}>
          <Text
            style={[
              styles.optionText,
              { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
            ]}>
            Lessons Points
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            { backgroundColor: theme === 'dark' ? '#3A3A3A' : '#FFFFFF' },
          ]}
          onPress={() => handlePress('Quizzes & Challenges Points')}>
          <Text
            style={[
              styles.optionText,
              { color: theme === 'dark' ? '#FFFFFF' : '#2A2D57' },
            ]}>
            Quizzes & Challenges Points
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 40 },
  optionButton: {
    width: '90%',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  optionText: { fontSize: 18, fontWeight: 'bold' },
});

export default PointsCategoryScreen;
