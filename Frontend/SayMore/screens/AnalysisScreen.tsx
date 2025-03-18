import React from 'react';
import { View, StyleSheet } from 'react-native';
import Analysis_PS from '../components/Analysis_PS';
import Analysis_S from '../components/Analysis_S';

const AnalysisScreen = ({ route }) => {
  const { filename, acc_id, type, language, isPublicSpeaking } = route.params;

  return (
    <View style={styles.container}>
      {isPublicSpeaking ? (
        <Analysis_PS
          filename={filename}
          acc_id={acc_id}
          language={language}
          type={type} // Pass type to Analysis_PS
        />
      ) : (
        <Analysis_S
          filename={filename}
          acc_id={acc_id}
          language={language}
          type={type} // Pass type to Analysis_S
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