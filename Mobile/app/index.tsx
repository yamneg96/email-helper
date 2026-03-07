import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { HelpCircle, Mail, ShieldCheck, Sparkles, Zap } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="relative flex-1 px-4">
        <View className="flex-row items-center justify-between pb-2 pt-4">
          <View className="w-10" />
          <Text className="flex-1 text-center text-lg font-bold">Email Assistant</Text>
          <View className="w-10 items-end">
            <HelpCircle color="hsl(222 47% 11%)" size={20} />
          </View>
        </View>

        <View className="mt-4 h-[290px] w-full rounded-xl bg-slate-200 dark:bg-slate-800" />

        <View className="flex-1 items-center px-2 pt-8">
          <Text className="text-center text-[32px] font-bold leading-tight text-slate-900 dark:text-slate-100">
            Email made easy for everyone
          </Text>
          <Text className="pt-3 text-center text-base text-slate-600 dark:text-slate-400">
            Manage your inbox, draft perfect replies, and stay organized with your personal
            AI-powered email assistant.
          </Text>

          <View className="mt-8 w-full gap-4">
            <Button className="h-14 rounded-xl" onPress={() => router.push('/sign-in')}>
              <Text className="text-lg font-bold text-primary-foreground">Get Started</Text>
            </Button>
            <Button
              className="h-14 rounded-xl border-2"
              variant="outline"
              onPress={() => router.push('/sign-in')}>
              <Text className="text-base font-semibold text-slate-700 dark:text-slate-300">
                I already have an account
              </Text>
            </Button>
          </View>
        </View>

        <View
          className="mx-auto mb-8 mt-10 flex-row justify-between rounded-xl px-2"
          style={{ width: '100%' }}>
          <FeatureItem icon={Sparkles} label="AI Powered" />
          <FeatureItem icon={ShieldCheck} label="Secure" />
          <FeatureItem icon={Zap} label="Fast Setup" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
}) {
  return (
    <View className="items-center">
      <View className="mb-2 rounded-full bg-primary/10 p-3">
        <Icon color="hsl(221 83% 53%)" size={18} />
      </View>
      <Text className="text-xs font-medium text-slate-500">{label}</Text>
    </View>
  );
}
