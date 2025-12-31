import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="(tabs)"
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="progress"
        options={{ title: 'Progress' }}
      />
    </Drawer>
  );
}
