import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Dimensions} from "react-native";
import { LineChart } from "react-native-chart-kit";

const dataPoints = [
  { date: "01", points: 20 },
  { date: "02", points: 40 },
  { date: "03", points: 35 },
  { date: "04", points: 50 },
  { date: "05", points: 65 },
  { date: "06", points: 80 },
  { date: "07", points: 90 },
  { date: "08", points: 110 },
  { date: "09", points: 130 },
  { date: "10", points: 150 },
  { date: "11", points: 160 },
  { date: "12", points: 175 },
  { date: "13", points: 190 },
  { date: "14", points: 200 },
];

interface UserRecord {
  score: number;
}

interface Props {
  userRecords: UserRecord[];
}

const ActivityScreen: React.FC<Props> = ({ userRecords ,navigation}) => {
  const [animatedData, setAnimatedData] = useState<{ date: string; points: number }[]>([]);
  const [stats, setStats] = useState({ avgScore: 0, highestScore: 0, totalQuizzes: 0 });

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < dataPoints.length) {
        setAnimatedData((prevData) => [...prevData, dataPoints[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userRecords && userRecords.length > 0) {
      const totalScore = userRecords.reduce((acc, record) => acc + record.score, 0);
      const highestScore = Math.max(...userRecords.map((record) => record.score));
      setStats({
        avgScore: parseFloat((totalScore / userRecords.length).toFixed(2)),
        highestScore: highestScore,
        totalQuizzes: userRecords.length,
      });
    }
  }, [userRecords]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've been improving my quiz scores! My highest score is ${stats.highestScore} points! 🎯`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: animatedData.map((item) => item.date),
            datasets: [{ data: animatedData.map((item) => item.points) }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#007AFF" },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Your average score this month: {stats.avgScore} points</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Your highest score: {stats.highestScore} points</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Total Quizzes Taken: {stats.totalQuizzes}</Text>
      </View>
      <Text style={styles.footerText}>Your scores have been steadily improving. Keep up the great work!</Text>
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareText}>Share your achievement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  chartContainer: { alignItems: "center", padding: 10, backgroundColor: "#DFF6FF", borderRadius: 10 },
  infoBox: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, marginVertical: 5, alignItems: "center" },
  infoText: { color: "white", fontSize: 16, fontWeight: "bold" },
  footerText: { textAlign: "center", marginTop: 10, fontSize: 16 },
  shareButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  shareText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ActivityScreen;