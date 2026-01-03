import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import {
  getProgressStats,
  ProgressStats,
} from '../../src/services/progressApi';

export default function ProgressScreen() {
  const [stats, setStats] = useState<ProgressStats>({
    total: 0,
    completed: 0,
    percentage: 0,
  });

  const loadProgress = async () => {
    const data = await getProgressStats();
    setStats(data);
  };

  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Study Progress</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Assignments</Text>
        <Text style={styles.value}>{stats.total}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completed</Text>
        <Text style={styles.value}>{stats.completed}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completion Rate</Text>
        <Text style={styles.value}>{stats.percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
