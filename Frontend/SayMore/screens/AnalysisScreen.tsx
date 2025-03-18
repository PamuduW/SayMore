import React from 'react';
import { View, StyleSheet } from 'react-native';
import Analysis_PS from '../components/Analysis_PS';
import Analysis_S from '../components/Analysis_S';

const AnalysisScreen = ({ route }) => {
  const { filename, acc_id, type, language } = route.params;

  return (
    <View style={styles.container}>
      {type ? (
        <Analysis_PS
          filename={filename}
          acc_id={acc_id}
          language={language}
          type={type}
        />
      ) : (
        <Analysis_S
          filename={filename}
          acc_id={acc_id}
          language={language}
          type={type}
        />
      )}
    </View>
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
