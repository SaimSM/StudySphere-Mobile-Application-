import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import {
  getSubjects,
  addSubject,
  deleteSubject,
  updateSubject,
} from '../../../services/api';

export default function TimetableScreen() {
  const [subjects, setSubjects] = useState<any[]>([]);

  const loadSubjects = async () => {
    const data = await getSubjects();
    setSubjects(data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleAdd = async () => {
    await addSubject({
      title: 'New Subject',
      day: 'Friday',
      time: '1:00 PM',
    });
    loadSubjects();
  };

  const handleDelete = async (id: string) => {
    await deleteSubject(id);
    loadSubjects();
  };

  const handleUpdate = async (id: string) => {
    await updateSubject(id, {
      title: 'Updated Subject',
    });
    loadSubjects();
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
                marginTop: 8,
                justifyContent: 'space-between',
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
