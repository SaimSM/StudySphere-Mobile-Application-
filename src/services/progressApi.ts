import AsyncStorage from '@react-native-async-storage/async-storage';
import { Assignment } from './assignmentsApi';

const ASSIGNMENTS_KEY = 'STUDYSPHERE_ASSIGNMENTS';

export interface ProgressStats {
  total: number;
  completed: number;
  percentage: number;
}

export const getProgressStats = async (): Promise<ProgressStats> => {
  const data = await AsyncStorage.getItem(ASSIGNMENTS_KEY);
  const assignments: Assignment[] = data ? JSON.parse(data) : [];

  const total = assignments.length;
  const completed = assignments.filter(a => a.completed).length;
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    percentage,
  };
};
