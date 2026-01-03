import { View, Text, StyleSheet, useColorScheme, Animated } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAssignments } from '../../src/services/assignmentsApi';

const STORAGE_KEY = 'progress_cache';

export default function ProgressScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // 🔁 Load analytics every time tab opens
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadProgress = async () => {
        try {
          const data = await getAssignments();
          if (!active) return;

          const totalCount = data.length;
          const completedCount = data.filter(a => a.completed).length;

          setTotal(totalCount);
          setCompleted(completedCount);

          // 💾 Cache for offline
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ totalCount, completedCount })
          );

          animateProgress(totalCount, completedCount);
        } catch {
          // 📦 Offline fallback
          const cached = await AsyncStorage.getItem(STORAGE_KEY);
          if (!cached || !active) return;

          const parsed = JSON.parse(cached);
          setTotal(parsed.totalCount);
          setCompleted(parsed.completedCount);
          animateProgress(parsed.totalCount, parsed.completedCount);
        }
      };

      loadProgress();
      return () => {
        active = false;
      };
    }, [])
  );

  const animateProgress = (totalCount: number, completedCount: number) => {
    const percent =
      totalCount === 0 ? 0 : completedCount / totalCount;

    Animated.timing(progressAnim, {
      toValue: percent,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? '#0f172a' : '#f8fafc' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: dark ? '#e5e7eb' : '#0f172a' },
        ]}
      >
        📊 Study Progress
      </Text>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: dark ? '#1e293b' : '#e5e7eb' },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.percentText,
          { color: dark ? '#cbd5f5' : '#1e3a8a' },
        ]}
      >
        {percentage}% Completed
      </Text>

      {/* Stats Cards */}
      <View style={styles.row}>
        <StatCard
          label="Total"
          value={total}
          dark={dark}
        />
        <StatCard
          label="Completed"
          value={completed}
          dark={dark}
        />
      </View>

      {total === 0 && (
        <Text style={[styles.empty, { color: '#94a3b8' }]}>
          Add assignments to unlock analytics 📘
        </Text>
      )}
    </View>
  );
}

/* 🔹 Small reusable card */
function StatCard({
  label,
  value,
  dark,
}: {
  label: string;
  value: number;
  dark: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: dark ? '#020617' : '#ffffff',
          borderColor: dark ? '#1e293b' : '#e5e7eb',
        },
      ]}
    >
      <Text style={{ color: '#64748b' }}>{label}</Text>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          color: dark ? '#e5e7eb' : '#0f172a',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  progressTrack: {
    height: 14,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 10,
  },
  percentText: {
    marginTop: 10,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
  },
});
