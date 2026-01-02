import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import {
  getAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
  Assignment,
} from '../../../src/services/assignmentsApi';

export default function AssignmentsScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const loadData = async () => {
    const data = await getAssignments();
    setAssignments(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addNew = async () => {
    await addAssignment({
      title: 'New Assignment',
      subject: 'Math',
      dueDate: '2026-01-10',
      completed: false,
    });
    loadData();
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Add Assignment" onPress={addNew} />

      <FlatList
        data={assignments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginVertical: 8 }}>
            <Text>{item.title} - {item.subject}</Text>
            <Text>Due: {item.dueDate}</Text>

            <TouchableOpacity
              onPress={() => updateAssignment(item.id, { completed: !item.completed })}
            >
              <Text style={{ color: 'blue' }}>
                {item.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteAssignment(item.id)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
