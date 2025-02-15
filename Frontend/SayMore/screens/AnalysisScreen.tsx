import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const AnalysisScreen = ({ route }) => {
  const { filename, acc_id } = route.params;
  const [fileName, setFileName] = useState(filename);
  const [accountId, setAccountId] = useState(acc_id);

  useEffect(() => {
    const sendPostRequest = async () => {
//       const url = "https://saymore-ec85c1fe019f.herokuapp.com/test";
      const url = "http://127.0.0.1:8000/test";
      console.log("filename", fileName);
      console.log("acc_id", accountId);
      const body = {
        file_name: fileName,
        acc_id: accountId,
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
      } catch (error) {
        console.error("Error sending POST request:", error);
      }
    };

    sendPostRequest();
  }, [fileName, accountId]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Analysis Screen</Text>
    </View>
  );
};

export default AnalysisScreen;
