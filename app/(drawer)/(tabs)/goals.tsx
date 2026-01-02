import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
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

  const loadGoals = async () => {
    const data = await getGoals();
    setGoals(data);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAdd = async () => {
    await addGoal('Complete Mobile App Project');
    loadGoals();
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Add Goal" onPress={handleAdd} />

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 10,
              padding: 12,
              borderWidth: 1,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                textDecorationLine: item.completed
                  ? 'line-through'
                  : 'none',
                fontSize: 16,
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
              <TouchableOpacity
                onPress={() => {
                  toggleGoal(item.id);
                  loadGoals();
                }}
              >
                <Text style={{ color: 'green' }}>
                  {item.completed ? 'Undo' : 'Complete'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  deleteGoal(item.id);
                  loadGoals();
                }}
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
