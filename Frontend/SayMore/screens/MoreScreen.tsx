import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  MoreScreen: undefined;
  ActivityScreen: undefined;
  Lessons: undefined;
};

type MoreScreenNavigationProp = StackNavigationProp<RootStackParamList, "MoreScreen">;

interface Props {
  navigation: MoreScreenNavigationProp;
}

const MoreScreen: React.FC<Props> = ({ navigation }) => {
  const NewScreens = [
    { title: "Activity", screen: "ActivityScreen" },
    { title: "Lesson", screen: "Lessons" },
    { title: "Quizzes and Challenges", screen: "" },
    { title: "Progress", screen: "" },
    { title: "Points", screen: "" },
    { title: "Leaderboard", screen: "" },
    { title: "Speech Therapy", screen: "" },
  ];

  const handlePress = (screen: string) => {
    if (screen) {
      navigation.navigate(screen as keyof RootStackParamList);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {NewScreens.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.lessonButton}
            onPress={() => handlePress(item.screen)}
            disabled={!item.screen}
          >
            <Image source={require("../assets/videoicon.png")} style={styles.lessonIcon} />
            <Text style={styles.lessonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF", padding: 20 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lessonButton: {
    width: "48%",
    backgroundColor: "#E6F7FF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  lessonIcon: { width: 40, height: 40, marginBottom: 10 },
  lessonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
  },
});

export default MoreScreen;