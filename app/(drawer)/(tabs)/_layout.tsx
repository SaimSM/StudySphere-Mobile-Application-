import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="timetable"
        options={{ title: 'Timetable' }}
      />
      <Tabs.Screen
        name="assignments"
        options={{ title: 'Assignments' }}
      />
      <Tabs.Screen
        name="goals"
        options={{ title: 'Goals' }}
      />
    </Tabs>
  );
}
