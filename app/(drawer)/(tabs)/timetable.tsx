import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSubjects,
  addSubject,
  deleteSubject,
  updateSubject,
} from '../../../src/services/timetableApi';

const STORAGE_KEY = 'subjects_cache';

export default function TimetableScreen() {
  const [subjects, setSubjects] = useState<any[]>([]);

  // ✅ LOAD SUBJECTS (API + CACHE)
  const loadSubjects = async () => {
    try {
      // Load cached data first
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        setSubjects(JSON.parse(cached));
      }

      // Fetch from API
      const data = await getSubjects();
      setSubjects(data);

      // Save fresh data
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.log('Network error, using cached data');
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // ✅ ADD
  const handleAdd = async () => {
    try {
      await addSubject({
        title: 'New Subject',
        day: 'Friday',
        time: '1:00 PM',
      });
      loadSubjects();
    } catch {
      alert('Network error');
    }
  };

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      loadSubjects();
    } catch {
      alert('Network error');
    }
  };

  // ✅ UPDATE
  const handleUpdate = async (id: string) => {
    try {
      await updateSubject(id, {
        title: 'Updated Subject',
      });
      loadSubjects();
    } catch {
      alert('Network error');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Add Subject" onPress={handleAdd} />

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 6,
            }}
          >
            <Text>
              {item.title} - {item.day} ({item.time})
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => handleUpdate(item.id)}
              >
                <Text style={{ color: 'blue' }}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
