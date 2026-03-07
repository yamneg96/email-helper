import { useAppState } from '@/lib/app-context';
import { Redirect, Tabs } from 'expo-router';

export default function TabsLayout() {
  const { token } = useAppState();

  if (!token) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="inbox" />
      <Tabs.Screen name="compose" />
      <Tabs.Screen name="templates" />
      <Tabs.Screen name="sent" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
