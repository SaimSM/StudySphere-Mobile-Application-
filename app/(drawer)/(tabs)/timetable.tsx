import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from '../../../src/services/timetableApi';

const STORAGE_KEY = 'subjects_cache';

export default function TimetableScreen() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  // 🔹 Check internet
  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      setIsOnline(!!state.isConnected);
    });
    return () => unsub();
  }, []);

  // 🔹 Load from cache + API
  const loadSubjects = async () => {
    const cached = await AsyncStorage.getItem(STORAGE_KEY);
    if (cached) setSubjects(JSON.parse(cached));

    if (isOnline) {
      try {
        const apiData = await getSubjects();
        setSubjects(apiData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
      } catch {}
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [isOnline]);

  // 🔹 SAVE LOCAL
  const saveLocal = async (data: any[]) => {
    setSubjects(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // 🔹 ADD
  const handleAdd = async () => {
    const newItem = {
      id: Date.now().toString(),
      title: 'New Subject',
      day: 'Monday',
      time: '10:00 AM',
    };

    const updated = [newItem, ...subjects];
    await saveLocal(updated);

    if (isOnline) {
      try {
        await addSubject(newItem);
      } catch {}
    }
  };

  // 🔹 UPDATE
  const handleUpdate = async (id: string) => {
    const updated = subjects.map(item =>
      item.id === id ? { ...item, title: 'Updated Subject' } : item
    );

    await saveLocal(updated);

    if (isOnline) {
      try {
        await updateSubject(id, { title: 'Updated Subject' });
      } catch {}
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id: string) => {
    const updated = subjects.filter(item => item.id !== id);
    await saveLocal(updated);

    if (isOnline) {
      try {
        await deleteSubject(id);
      } catch {}
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addText}>+ Add Subject</Text>
      </TouchableOpacity>

      <FlatList
        data={subjects}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No timetable added</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>
              {item.day} • {item.time}
            </Text>

            <View style={styles.row}>
              <TouchableOpacity onPress={() => handleUpdate(item.id)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  addBtn: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { color: '#6b7280', marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  edit: { color: '#2563eb' },
  delete: { color: '#dc2626' },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#9ca3af',
  },
});
