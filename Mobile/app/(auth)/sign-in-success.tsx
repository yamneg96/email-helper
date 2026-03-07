import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { router } from 'expo-router';
import { CheckCircle2, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, View } from 'react-native';

export default function SignInSuccessScreen() {
  const { user } = useAppState();
  const [progress, setProgress] = useState(0.85);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.onboarding.completed) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [user?.onboarding.completed]);

  const onContinue = () => {
    if (user?.onboarding.completed) {
      router.replace('/dashboard');
      return;
    }

    router.replace('/onboarding');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="flex-1 items-center justify-center px-4">
        <View className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-900">
          <View className="flex-row items-center border-b border-slate-100 p-4 dark:border-slate-800">
            <Pressable className="h-10 w-10 items-center justify-center rounded-full">
              <X color="hsl(215 16% 47%)" size={20} />
            </Pressable>
            <Text className="flex-1 text-center text-lg font-bold text-slate-900 dark:text-slate-100">
              Verification
            </Text>
            <View className="w-10" />
          </View>

          <View className="items-center gap-8 px-8 py-12">
            <View className="relative items-center justify-center">
              <View className="absolute h-24 w-24 scale-125 rounded-full bg-primary/10" />
              <View className="h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                <CheckCircle2 color="white" size={48} />
              </View>
            </View>

            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Sign-in Successful
              </Text>
              <Text className="max-w-[280px] text-center text-base text-slate-600 dark:text-slate-400">
                Welcome back! We're taking you to your dashboard now.
              </Text>
            </View>

            <View className="w-full gap-4">
              <View className="gap-2">
                <View className="flex-row items-center justify-between px-1">
                  <Text className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Redirecting
                  </Text>
                  <Text className="text-xs font-bold text-primary">
                    {Math.round(progress * 100)}%
                  </Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${progress * 100}%` }}
                  />
                </View>
              </View>
              <Button className="h-12" onPress={onContinue}>
                <Text className="font-bold text-primary-foreground">Continue to Dashboard</Text>
              </Button>
            </View>
          </View>

          <View className="items-center border-t border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              Logged in via Google Account
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
