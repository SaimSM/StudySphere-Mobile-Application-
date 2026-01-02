import 'react-native-get-random-values'; // polyfill first
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'STUDYSPHERE_GOALS';

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

const getStoredGoals = async (): Promise<Goal[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveGoals = async (goals: Goal[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

// READ
export const getGoals = async (): Promise<Goal[]> => {
  return await getStoredGoals();
};

// CREATE
export const addGoal = async (title: string) => {
  const goals = await getStoredGoals();

  const newGoal: Goal = {
    id: uuidv4(),
    title,
    completed: false,
  };

  goals.push(newGoal);
  await saveGoals(goals);
};

// UPDATE
export const toggleGoal = async (id: string) => {
  const goals = await getStoredGoals();

  const updated = goals.map((g) =>
    g.id === id ? { ...g, completed: !g.completed } : g
  );

  await saveGoals(updated);
};

// DELETE
export const deleteGoal = async (id: string) => {
  const goals = await getStoredGoals();
  const filtered = goals.filter((g) => g.id !== id);
  await saveGoals(filtered);
};
