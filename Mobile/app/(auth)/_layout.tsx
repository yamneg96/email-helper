import { useAppState } from '@/lib/app-context';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { token, user } = useAppState();

  if (token) {
    const nextRoute = user?.onboarding.completed ? '/dashboard' : '/onboarding';
    return <Redirect href={nextRoute} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
