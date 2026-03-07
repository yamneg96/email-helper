import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { mobileApi } from '@/lib/api';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, View } from 'react-native';

const STEPS = [
  { title: 'How to write email', am: 'ኢሜይል እንዴት መጻፍ እንደሚቻል' },
  { title: 'Attach files', am: 'ፋይሎችን ማያያዝ' },
  { title: 'Send and track', am: 'ላክ እና ተከታተል' },
];

export default function OnboardingScreen() {
  const { token, refreshUser } = useAppState();
  const [step, setStep] = useState(0);
  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const finish = async () => {
    if (!token) {
      return;
    }

    await mobileApi.updateSettings(token, {
      onboardingStep: 3,
      onboardingCompleted: true,
    });
    await refreshUser();
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#f5f6f8] p-4 dark:bg-[#101622]">
      <View className="h-[760px] w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <View className="flex-row items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
          <Pressable className="rounded-full p-2">
            <Text className="text-slate-500">←</Text>
          </Pressable>
          <Text className="text-lg font-bold">Onboarding</Text>
          <Pressable onPress={finish}>
            <Text className="px-3 py-1 text-sm font-semibold text-primary">Skip</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-center gap-3 py-6">
          <View className="h-2 w-8 rounded-full bg-primary" />
          <View
            className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
          />
          <View
            className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
          />
        </View>

        <View className="flex-1 px-6">
          <View className="mb-6 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <View className="aspect-video w-full items-center justify-center bg-primary/10">
              <Text className="text-5xl">✉️</Text>
            </View>
            <View className="gap-2 p-5">
              <Text className="text-xl font-bold">{STEPS[step]?.title}</Text>
              <Text className="text-base text-slate-600 dark:text-slate-400">
                Learn the basics of composing professional messages.
              </Text>
            </View>
          </View>

          <View className="grid gap-3">
            <View className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
              <Text className="text-xs font-bold uppercase text-primary">English</Text>
              <Text className="mt-1 text-sm font-semibold">{STEPS[step]?.title}</Text>
            </View>
            <View className="rounded-lg border border-primary/10 bg-primary/5 p-4">
              <Text className="text-xs font-bold uppercase text-primary">Amharic</Text>
              <Text className="mt-1 text-sm font-semibold">{STEPS[step]?.am}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 border-t border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <Button
            className="h-12 flex-1"
            variant="outline"
            onPress={() => setStep((v) => Math.max(0, v - 1))}>
            <Text>Back</Text>
          </Button>
          {step < STEPS.length - 1 ? (
            <Button className="h-12 flex-[1.5]" onPress={() => setStep((v) => v + 1)}>
              <Text className="font-bold text-primary-foreground">Continue</Text>
            </Button>
          ) : (
            <Button className="h-12 flex-[1.5]" onPress={finish}>
              <Text className="font-bold text-primary-foreground">Finish / ጨርስ</Text>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
