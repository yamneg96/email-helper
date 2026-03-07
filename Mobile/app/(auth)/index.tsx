import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { HelpCircle, ShieldCheck, Sparkles, Zap } from 'lucide-react-native';
import { ImageBackground, View } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCHjj9QqcpEHi9lU8Xoa7MwC-jWjfrk35s1F-hzMV69Zp_7vuvWTPnuLTrkh90fa3H6qgT5IJ-VW8dlokjBInhY9Dm2XS8GW5NtWGnKLTtwfj-Sq6VWAZIrtUg0dny8OhDih2MHvpo0WxxfLYBqfhpsyyyejREEKoUD2xNBAHjvkyPVE9yQ1D8b4LpdrbbFwS_8xsB27pVn5-xo5Av5sujbs-y-Ka0xpbt0nk3es9Ps7seZ2gVdd4XDiDlcJIeamOjoBYe5AJ2e-jw';

export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <ScrollView
        className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]"
        contentContainerStyle={{ flexGrow: 1 }}>
        <View className="relative flex-1 overflow-hidden bg-[#f5f6f8] dark:bg-[#101622]">
          <View className="z-10 flex-row items-center justify-between bg-[#f5f6f8] p-4 pb-2 dark:bg-[#101622]">
            <View className="w-10" />
            <Text className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              Email Assistant
            </Text>
            <View className="flex w-10 items-end justify-center">
              <HelpCircle color="hsl(222 47% 11%)" size={20} />
            </View>
          </View>

          <View className="flex-1">
            <View className="px-4 py-3">
              <ImageBackground
                source={{ uri: HERO_IMAGE }}
                resizeMode="cover"
                className="h-[400px] w-full overflow-hidden rounded-xl bg-slate-200 shadow-sm dark:bg-slate-800"
              />
            </View>

            <View className="mx-auto w-full max-w-2xl items-center px-6">
              <Text className="pb-3 pt-8 text-center text-[32px] font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                Email made easy for everyone
              </Text>
              <Text className="max-w-md pb-8 pt-1 text-center text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Manage your inbox, draft perfect replies, and stay organized with your personal
                AI-powered email assistant.
              </Text>

              <View className="w-full gap-4 pb-12">
                <Button className="h-14 rounded-xl" onPress={() => router.push('/sign-in')}>
                  <Text className="text-lg font-bold text-primary-foreground">Get Started</Text>
                </Button>
                <Button
                  className="h-14 rounded-xl border-2 border-slate-200 dark:border-slate-800"
                  variant="outline"
                  onPress={() => router.push('/sign-in')}>
                  <Text className="text-base font-semibold text-slate-700 dark:text-slate-300">
                    I already have an account
                  </Text>
                </Button>
              </View>
            </View>

            <View className="mx-auto w-full max-w-2xl flex-row gap-4 px-6 pb-12">
              <FeatureItem icon={Sparkles} label="AI Powered" />
              <FeatureItem icon={ShieldCheck} label="Secure" />
              <FeatureItem icon={Zap} label="Fast Setup" />
            </View>

            <View className="h-4 bg-[#f5f6f8] dark:bg-[#101622]" />
          </View>
        </View>
      </ScrollView>
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
    <View className="flex-1 items-center">
      <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon color="hsl(221 83% 53%)" size={18} />
      </View>
      <Text className="text-xs font-medium text-slate-500">{label}</Text>
    </View>
  );
}
