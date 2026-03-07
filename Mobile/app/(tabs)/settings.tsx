import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { AppLanguage, mobileApi } from '@/lib/api';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { token, user, signOut, refreshUser } = useAppState();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [status, setStatus] = useState('');

  const onSave = async () => {
    if (!token) {
      return;
    }

    await mobileApi.updateSettings(token, {
      theme: colorScheme === 'dark' ? 'dark' : 'light',
    });
    await refreshUser();
    setStatus('Saved / ተቀምጧል');
  };

  const onLanguage = async (language: AppLanguage) => {
    if (!token) {
      return;
    }

    await mobileApi.updateSettings(token, { language });
    await refreshUser();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="mx-auto w-full max-w-md flex-1 bg-white dark:bg-slate-900">
        <View className="flex-row items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center">
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="pr-12 text-lg font-bold">Settings</Text>
        </View>

        <View className="flex-1 px-4 pb-24">
          <View className="items-center gap-4 py-6">
            <View className="relative">
              <View className="h-24 w-24 rounded-full border-4 border-white bg-slate-200 dark:border-slate-800 dark:bg-slate-700" />
              <View className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary p-1.5 dark:border-slate-900">
                <Text className="text-xs text-white">✎</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold">{user?.name || 'Abebe Bikila'}</Text>
              <Text className="text-sm text-slate-500">
                {user?.email || 'abebe.bikila@email.com'}
              </Text>
            </View>
            <Pressable className="h-11 min-w-[120px] items-center justify-center rounded-xl bg-primary/10 px-6">
              <Text className="text-sm font-bold text-primary">Change Account</Text>
            </Pressable>
          </View>

          <Text className="px-2 pb-2 pt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Preferences
          </Text>
          <SettingRow
            icon="🌐"
            title="Language"
            subtitle="Choose your interface language"
            value={user?.language === 'am' ? 'Amharic' : 'English'}
            onPress={() => onLanguage(user?.language === 'am' ? 'en' : 'am')}
          />
          <SettingRow
            icon="◐"
            title="Dark Mode"
            subtitle="Reduce eye strain"
            value={colorScheme === 'dark' ? 'On' : 'Off'}
            onPress={toggleColorScheme}
          />

          <Text className="px-2 pb-2 pt-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            Support
          </Text>
          <SettingRow icon="?" title="Help Center" onPress={() => {}} />

          <Pressable
            className="mt-12 h-14 w-full flex-row items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 dark:border-red-900/20 dark:bg-red-900/10"
            onPress={signOut}>
            <Text className="text-red-600 dark:text-red-400">↪</Text>
            <Text className="font-bold text-red-600 dark:text-red-400">Log Out</Text>
          </Pressable>
          <Text className="mt-6 text-center text-xs text-slate-400">Version 2.4.0 (Build 441)</Text>

          <Pressable
            className="mt-4 h-10 items-center justify-center rounded-lg border border-primary/20"
            onPress={onSave}>
            <Text className="font-semibold text-primary">Save Preferences</Text>
          </Pressable>
          {status ? <Text className="mt-2 text-center text-xs text-primary">{status}</Text> : null}
        </View>

        <View className="absolute bottom-0 left-0 right-0 flex-row gap-2 border-t border-slate-100 bg-white px-4 pb-6 pt-3 dark:border-slate-800 dark:bg-slate-900">
          <BottomItem label="Inbox" icon="✉" onPress={() => router.replace('/inbox')} />
          <BottomItem label="Assistant" icon="◌" onPress={() => router.replace('/dashboard')} />
          <BottomItem
            label="Settings"
            icon="⚙"
            active
            onPress={() => router.replace('/settings')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="mb-2 min-h-16 flex-row items-center justify-between rounded-xl bg-slate-50/60 px-4 dark:bg-slate-800/40"
      onPress={onPress}>
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Text className="text-primary">{icon}</Text>
        </View>
        <View>
          <Text className="text-base font-medium">{title}</Text>
          {subtitle ? <Text className="text-xs text-slate-500">{subtitle}</Text> : null}
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        {value ? <Text className="text-sm font-semibold">{value}</Text> : null}
        <Text className="text-slate-400">›</Text>
      </View>
    </Pressable>
  );
}

function BottomItem({
  label,
  icon,
  active = false,
  onPress,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable className="flex-1 items-center" onPress={onPress}>
      <Text className={`${active ? 'text-primary' : 'text-slate-400'} text-base`}>{icon}</Text>
      <Text className={`text-xs ${active ? 'font-semibold text-primary' : 'text-slate-400'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
