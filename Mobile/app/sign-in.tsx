import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { router } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { signIn } = useAppState();
  const [name, setName] = useState('New User');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn(email, name || 'New User');
      router.replace('/sign-in-success');
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="flex-1 items-center justify-center px-4">
        <View className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <View className="mb-8 items-center">
            <View className="mb-3 rounded-xl bg-primary/10 p-4">
              <Mail color="hsl(221 83% 53%)" size={28} />
            </View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Welcome to Email Assistant
            </Text>
            <Text className="mt-2 text-center text-base text-slate-600 dark:text-slate-400">
              The simplest way to manage your inbox. Get started by signing into your account.
            </Text>
          </View>

          <View className="gap-3">
            <TextInput
              className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Name / ስም"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Email / ኢሜይል"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
            <Button className="mt-2 h-14" onPress={onSignIn}>
              <Text className="font-bold text-primary-foreground">
                {loading ? 'Signing in...' : 'Sign in with Google / በGoogle ይግቡ'}
              </Text>
            </Button>
            <Text className="pt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
