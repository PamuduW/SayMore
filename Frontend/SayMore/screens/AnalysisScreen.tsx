import React from 'react';
import { StyleSheet } from 'react-native';
import Analysis_PS from '../components/Analysis_PS';
import Analysis_S from '../components/Analysis_S';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

/**
 * AnalysisScreen component that displays either the Analysis_PS or Analysis_S component
 * based on the type of analysis.
 * @param {Object} route - The route object containing navigation parameters.
 * @param {string} route.params.filename - The filename of the audio file.
 * @param {string} route.params.acc_id - The account ID of the user.
 * @param {string} route.params.type - The type of the test.
 * @param {string} route.params.language - The language of the test.
 * @returns {JSX.Element} The rendered component.
 */
const AnalysisScreen = ({ route }) => {
  const { filename, acc_id, type, language } = route.params;
  const theme = useTheme();

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
      }
      style={styles.container}>
      {type ? (
        <Analysis_PS
          filename={filename}
          acc_id={acc_id}
          language={language}
          type={type}
        />
      ) : (
        <Analysis_S filename={filename} acc_id={acc_id} type={type} />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnalysisScreen;
