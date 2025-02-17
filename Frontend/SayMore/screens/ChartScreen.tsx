import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const Chart2Screen = () => {
    const screenWidth = Dimensions.get("window").width;

    const lineData = [0, 10, 8, 58, 56, 78];
    const lineData2 = [0, 20, 18, 40, 36, 60];
    const lineData3 = [0, 30, 10, 50, 46, 70];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Good Job!</Text>
            <Text style={styles.subHeader}>Analysis of the Speech</Text>
            <View style={styles.chartContainer}>
                <LineChart
                    data={{
                        labels: ["1", "2", "3", "4", "5", "6"], // X-axis labels
                        datasets: [
                            { data: lineData, strokeWidth: 2 },
                            { data: lineData2, strokeWidth: 2 },
                            { data: lineData3, strokeWidth: 2 },
                        ]
                    }}
                    width={screenWidth - 40} // Responsive width
                    height={250}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#f5f5f5",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black for text
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        propsForDots: { r: "4", strokeWidth: "2", stroke: "#ffa726" },
                        propsForBackgroundLines: { strokeDasharray: "" }, // Removes dashed background lines
                    }}
                    bezier // Makes the lines curved
                    style={styles.chart}
                />
            </View>
            <View style={styles.legendContainer}>
                <Text style={[styles.legendText, { color: "blue" }]}>Pitch</Text>
                <Text style={[styles.legendText, { color: "orange" }]}>Volume</Text>
                <Text style={[styles.legendText, { color: "green" }]}>Pace</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Ah-Count</Text>
                <Text style={styles.label}>Time Duration</Text>
                <Text style={styles.label}>Pause Count</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", padding: 20 },
    header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    subHeader: { fontSize: 16, marginBottom: 20 },
    chartContainer: { marginBottom: 20 },
    chart: { marginVertical: 10, borderRadius: 16 },
    legendContainer: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 },
    legendText: { fontSize: 14, fontWeight: "600" },
    row: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginBottom: 10 },
    label: { fontSize: 14, fontWeight: "600" }
});

export default Chart2Screen;
