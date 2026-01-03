import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import {
  getGoals,
  addGoal,
  toggleGoal,
  deleteGoal,
  Goal,
} from '../../../src/services/goalsApi';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    getGoals().then(setGoals);
  }, []);

  const handleAdd = async () => {
    const tempGoal: Goal = {
      id: Date.now().toString(),
      title: 'Complete Mobile App Project',
      completed: false,
    };

    // ✅ UI FIRST
    setGoals(prev => [tempGoal, ...prev]);
    Alert.alert('Added', 'Goal added');

    try {
      await addGoal(tempGoal.title);
    } catch {
      Alert.alert('Error', 'Failed to save goal');
    }
  };

  const handleToggle = async (id: string) => {
    setGoals(prev =>
      prev.map(g =>
        g.id === id ? { ...g, completed: !g.completed } : g
      )
    );

    try {
      await toggleGoal(id);
    } catch {
      Alert.alert('Error', 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    Alert.alert('Deleted', 'Goal removed');

    try {
      await deleteGoal(id);
    } catch {
      Alert.alert('Error', 'Delete failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={handleAdd}
        style={{
          backgroundColor: '#7c3aed',
          padding: 14,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          + Add Goal
        </Text>
      </TouchableOpacity>

      {goals.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#777' }}>
          No goals yet 🎯
        </Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 14,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                }}
              >
                {item.title}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <TouchableOpacity onPress={() => handleToggle(item.id)}>
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
