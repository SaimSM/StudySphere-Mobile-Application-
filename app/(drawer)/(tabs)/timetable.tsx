import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import {
  getSubjects,
  addSubject,
  deleteSubject,
  updateSubject,
} from '../../../src/services/timetableApi';

type Subject = {
  id: string;
  title: string;
  day: string;
  time: string;
};

export default function TimetableScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    getSubjects().then(setSubjects);
  }, []);

  // ✅ ADD AT TOP (UI FIRST)
  const handleAdd = async () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      title: 'New Subject',
      day: 'Friday',
      time: '1:00 PM',
    };

    setSubjects(prev => [newSubject, ...prev]);
    Alert.alert('Added', 'Subject added');

    try {
      await addSubject(newSubject);
    } catch {
      Alert.alert('Error', 'Failed to save subject');
    }
  };

  // ✅ UPDATE LOCALLY
  const handleUpdate = async (id: string) => {
    setSubjects(prev =>
      prev.map(s =>
        s.id === id ? { ...s, title: 'Updated Subject' } : s
      )
    );

    try {
      await updateSubject(id, { title: 'Updated Subject' });
    } catch {
      Alert.alert('Error', 'Update failed');
    }
  };

  // ✅ DELETE LOCALLY
  const handleDelete = async (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    Alert.alert('Deleted', 'Subject removed');

    try {
      await deleteSubject(id);
    } catch {
      Alert.alert('Error', 'Delete failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={handleAdd}
        style={{
          backgroundColor: '#0ea5e9',
          padding: 14,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          + Add Subject
        </Text>
      </TouchableOpacity>

      {subjects.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#777' }}>
          No subjects added 📅
        </Text>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {item.title}
              </Text>
              <Text style={{ color: '#555' }}>
                {item.day} • {item.time}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <TouchableOpacity onPress={() => handleUpdate(item.id)}>
                  <Text style={{ color: 'blue' }}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={{ color: 'red' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
