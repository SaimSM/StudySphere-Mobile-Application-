import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getAssignments } from '../../src/services/assignmentsApi';

export default function ProgressScreen() {
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    getAssignments().then(data => {
      setTotal(data.length);
      setCompleted(data.filter(a => a.completed).length);
    });
  }, []);

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Study Progress</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Assignments</Text>
        <Text style={styles.value}>{total}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completed</Text>
        <Text style={styles.value}>{completed}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completion Rate</Text>
        <Text style={styles.value}>{percentage}%</Text>
      </View>

      {total === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
          Add assignments to see progress 📊
        </Text>
      )}
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
