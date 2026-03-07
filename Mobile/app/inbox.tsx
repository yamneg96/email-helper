import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { mobileApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, View } from 'react-native';

export default function InboxScreen() {
  const { token } = useAppState();
  const query = useQuery({
    queryKey: ['mobile-inbox-list', token],
    queryFn: () => mobileApi.inbox(token as string),
    enabled: Boolean(token),
  });

  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="flex-1">
        <View className="border-b border-slate-200 bg-white/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90">
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Text className="text-slate-500">☰</Text>
              <Text className="text-xl font-bold">Inbox</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-slate-500">⌕</Text>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Text className="text-xs font-bold text-primary">JD</Text>
              </View>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}>
            <Chip label="Primary" active />
            <Chip label="Social" />
            <Chip label="Promotions" />
            <Chip label="Updates" />
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ gap: 12, paddingBottom: 120 }}>
          {query.data?.items?.map((item) => (
            <View
              key={item.messageId}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <View className="mb-1 flex-row items-start justify-between">
                <Text className="max-w-[70%] text-lg font-bold">
                  {item.sender || 'Unknown Sender'}
                </Text>
                <Text className="text-xs text-slate-400">Now</Text>
              </View>
              <Text className="text-sm font-semibold text-primary">
                {item.subject || '(No subject)'}
              </Text>
              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {item.snippet}
              </Text>
              <View className="mt-4 flex-row items-center justify-end gap-4">
                <Text className="text-slate-300">☆</Text>
                <Text className="text-slate-300">↩</Text>
              </View>
            </View>
          ))}
          {!query.data?.items?.length ? (
            <View className="rounded-xl border border-dashed border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <Text className="text-center text-sm text-slate-500">No inbox items yet.</Text>
            </View>
          ) : null}
        </ScrollView>

        <Pressable
          className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary"
          onPress={() => router.push('/compose')}>
          <Text className="text-2xl text-white">✎</Text>
        </Pressable>

        <View className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 dark:border-slate-800 dark:bg-slate-900">
          <View className="flex-row items-center justify-between">
            <NavItem label="Mail" icon="✉" active onPress={() => router.replace('/inbox')} />
            <NavItem label="Chat" icon="◌" />
            <NavItem label="Meet" icon="◍" />
            <NavItem label="Events" icon="◫" />
            <NavItem label="Settings" icon="⚙" onPress={() => router.replace('/settings')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View
      className={`rounded-full px-4 py-1.5 ${
        active
          ? 'bg-primary'
          : 'border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}>
      <Text
        className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
        {label}
      </Text>
    </View>
  );
}

function NavItem({
  label,
  icon,
  active = false,
  onPress,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable className="items-center" onPress={onPress}>
      <Text className={`${active ? 'text-primary' : 'text-slate-400'} text-base`}>{icon}</Text>
      <Text className={`text-[10px] ${active ? 'font-bold text-primary' : 'text-slate-400'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
