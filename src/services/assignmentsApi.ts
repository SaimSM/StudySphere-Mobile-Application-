import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ASSIGNMENTS';

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
};

const getStoredData = async (): Promise<Assignment[]> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

const saveData = async (data: Assignment[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getAssignments = async () => {
  return await getStoredData();
};

export const addAssignment = async (assignment: Omit<Assignment, 'id'>) => {
  const data = await getStoredData();
  const newItem = { ...assignment, id: Date.now().toString() };
  const updated = [...data, newItem];
  await saveData(updated);
  return newItem;
};

export const updateAssignment = async (
  id: string,
  updates: Partial<Assignment>
) => {
  const data = await getStoredData();
  const updated = data.map(item =>
    item.id === id ? { ...item, ...updates } : item
  );
  await saveData(updated);
};

export const deleteAssignment = async (id: string) => {
  const data = await getStoredData();
  const updated = data.filter(item => item.id !== id);
  await saveData(updated);
};
