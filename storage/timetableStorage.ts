import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimetableItem } from "../types/timetable";

const KEY = "TIMETABLE_DATA";

export const saveTimetable = async (data: TimetableItem[]) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const loadTimetable = async (): Promise<TimetableItem[]> => {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
};

export const deleteTimetable = async () => {
  await AsyncStorage.removeItem(KEY);
};