import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface ProgressData {
  date: string;
  publicSpeakingPoints: number;
  stutteringPoints: number;
}

const QandCProgressScreen: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const snapshot = await firestore()
          .collection('UserProgress')
          .orderBy('date', 'asc')
          .get();

        const data = snapshot.docs.map(doc => doc.data() as ProgressData);
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching progress data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Quiz & Challenge Progress</Text>

      {/* Public Speaking Progress */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Public Speaking</Text>
        {progressData.length === 0 ? (
          <Text style={styles.noDataText}>No attempts yet.</Text>
        ) : (
          progressData.map((entry, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.attemptText}>Attempt {index + 1}</Text>
              <Text style={styles.pointsText}>Points: {entry.publicSpeakingPoints}</Text>
              <Text style={styles.dateText}>Date: {new Date(entry.date).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>

      {/* Stuttering Progress */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Stuttering</Text>
        {progressData.length === 0 ? (
          <Text style={styles.noDataText}>No attempts yet.</Text>
        ) : (
          progressData.map((entry, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.attemptText}>Attempt {index + 1}</Text>
              <Text style={styles.pointsText}>Points: {entry.stutteringPoints}</Text>
              <Text style={styles.dateText}>Date: {new Date(entry.date).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  attemptText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 16,
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QandCProgressScreen;
