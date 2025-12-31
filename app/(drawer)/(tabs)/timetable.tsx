import { View, Text, Button, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { getSubjects, addSubject } from '../../../services/api';

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
      title: 'Social Studies',
      day: 'Tuesnesday',
      time: '8:00 AM',
    });
    loadSubjects(); // refresh list
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Add Subject" onPress={handleAdd} />

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.title} - {item.day} ({item.time})
          </Text>
        )}
      />
    </View>
  );
}
