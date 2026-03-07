import '@/global.css';

import { AppProvider, useAppState } from '@/lib/app-context';
import { NAV_THEME } from '@/lib/theme';
import NetInfo from '@react-native-community/netinfo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

function AppStack() {
  const { colorScheme } = useColorScheme();
  const { setOnline } = useAppState();

  useEffect(() => {
    const subscription = NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected));
    });

    void Notifications.requestPermissionsAsync();

    return () => {
      subscription();
    };
  }, [setOnline]);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AppStack />
        </AppProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
