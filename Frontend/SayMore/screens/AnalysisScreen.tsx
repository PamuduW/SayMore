import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

const AnalysisScreen = ({ route }) => {
  const { filename, acc_id, type, language } = route.params;
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const sendPostRequest = async () => {
      try {
        const response = await fetch(
          'https://saymore-monorepo-8d4fc9b224ef.herokuapp.com/test',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file_name: filename,
              acc_id: acc_id,
              test_type: type,
              lan_flag: language,
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('Response data:', data);
        setResponseData(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type, language]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Analysis Screen</Text>
      {responseData && <Text style={styles.responseText}>{responseData}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  responseText: { marginTop: 10, padding: 10 },
});

export default AnalysisScreen;
