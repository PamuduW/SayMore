import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Analysis_S = ({ route }) => {
  const { filename, acc_id, type, language } = route.params;
  const [responseData, setResponseData] = useState(null);
  const navigation = useNavigation();

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

        const responseInfo = await response.json();
        setResponseData(responseInfo);
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    };

    sendPostRequest();
  }, [filename, acc_id, type, language]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Analysis Screen</Text>
      {responseData && (
        <View>
          <Text style={styles.jsonText}>
            {JSON.stringify(responseData, null, 2)}
          </Text>
        </View>
      )}
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
  jsonText: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginVertical: 10,
  },
});

export default Analysis_S;
