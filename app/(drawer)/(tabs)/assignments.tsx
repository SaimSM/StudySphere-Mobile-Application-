import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
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

  useEffect(() => {
    getAssignments().then(setAssignments);
  }, []);

  const handleAdd = async () => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: 'New Assignment',
      subject: 'Math',
      dueDate: '2026-01-10',
      completed: false,
    };

    setAssignments(prev => [newAssignment, ...prev]);
    Alert.alert('Added', 'Assignment added');

    try {
      await addAssignment(newAssignment);
    } catch {
      Alert.alert('Error', 'Failed to save');
    }
  };

  const toggleComplete = async (id: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );

    try {
      await updateAssignment(id, {
        completed: !assignments.find(a => a.id === id)?.completed,
      });
    } catch {
      Alert.alert('Error', 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    Alert.alert('Deleted', 'Assignment removed');

    try {
      await deleteAssignment(id);
    } catch {
      Alert.alert('Error', 'Delete failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={handleAdd}
        style={{
          backgroundColor: '#2563eb',
          padding: 14,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          + Add Assignment
        </Text>
      </TouchableOpacity>

      {assignments.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          No assignments 📘
        </Text>
      ) : (
        <FlatList
          data={assignments}
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
              <Text style={{ fontSize: 16 }}>
                {item.title} – {item.subject}
              </Text>
              <Text style={{ color: '#666' }}>Due: {item.dueDate}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <TouchableOpacity onPress={() => toggleComplete(item.id)}>
                  <Text style={{ color: 'green' }}>
                    {item.completed ? 'Undo' : 'Complete'}
                  </Text>
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
