import React from 'react';
import { StyleSheet } from 'react-native';
import Analysis_PS from '../components/Analysis_PS';
import Analysis_S from '../components/Analysis_S';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

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
