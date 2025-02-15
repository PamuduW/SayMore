import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const AnalysisScreen = ({ route }) => {
  const { filename, acc_id } = route.params;
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const sendPostRequest = async () => {
      const url = "https://saymore-ec85c1fe019f.herokuapp.com/test";
      const body = {
        file_name: filename,
        acc_id: acc_id,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);
        setResponseData(JSON.stringify(data, null, 2)); // Convert JSON to formatted string
      } catch (error) {
        console.error("Error sending POST request:", error);
      }
    };

    sendPostRequest();
  }, [filename, acc_id]);

  return (
    <View style={styles.container}>
      <Text>Analysis Screen</Text>
      {responseData && <Text style={styles.responseText}>{responseData}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  responseText: {
    marginTop: 10,
    padding: 10,
  },
});

export default AnalysisScreen;
