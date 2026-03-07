import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { mobileApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TemplatesScreen() {
  const { token } = useAppState();

  const templatesQuery = useQuery({
    queryKey: ['mobile-templates-list', token],
    queryFn: () => mobileApi.templates(token as string),
    enabled: Boolean(token),
  });

  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="flex-1">
        <View className="border-b border-slate-200 bg-white/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90">
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => router.back()}
                className="h-10 w-10 items-center justify-center rounded-full">
                <Text className="text-slate-600 dark:text-slate-400">←</Text>
              </Pressable>
              <Text className="text-xl font-bold tracking-tight">Templates</Text>
            </View>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Text className="text-lg text-primary">+</Text>
            </Pressable>
          </View>
          <View className="flex-row gap-6 px-2 pt-1">
            <Tab label="All" active />
            <Tab label="Email" />
            <Tab label="Professional" />
            <Tab label="Personal" />
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ gap: 12, paddingBottom: 120 }}>
          {templatesQuery.data?.items?.map((item) => (
            <View
              key={item._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <View className="aspect-[21/9] bg-slate-200 dark:bg-slate-800" />
              <View className="p-4">
                <View className="mb-2 flex-row items-start justify-between">
                  <Text className="text-lg font-bold">{item.name}</Text>
                  <View className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
                    <Text className="text-[10px] font-bold uppercase text-slate-500">Email</Text>
                  </View>
                </View>
                <Text className="text-sm text-slate-500 dark:text-slate-400">{item.subject}</Text>
                <View className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                  <Text
                    className="text-sm italic text-slate-600 dark:text-slate-300"
                    numberOfLines={2}>
                    {item.body}
                  </Text>
                </View>
                <View className="mt-4 flex-row items-center justify-between">
                  <Text className="text-xs text-slate-400">Recent template</Text>
                  <Pressable
                    className="h-9 items-center justify-center rounded-lg bg-primary px-4"
                    onPress={() => router.push('/compose')}>
                    <Text className="text-sm font-semibold text-white">Use Template</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          {!templatesQuery.data?.items?.length ? (
            <View className="rounded-xl border border-dashed border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <Text className="text-center text-sm text-slate-500">No templates yet.</Text>
            </View>
          ) : null}
        </ScrollView>

        <View className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 dark:border-slate-800 dark:bg-slate-900">
          <View className="flex-row items-center justify-around">
            <NavItem label="Dashboard" icon="▦" onPress={() => router.replace('/dashboard')} />
            <NavItem
              label="Templates"
              icon="▤"
              active
              onPress={() => router.replace('/templates')}
            />
            <NavItem label="Drafts" icon="✎" onPress={() => router.replace('/compose')} />
            <NavItem label="Settings" icon="⚙" onPress={() => router.replace('/settings')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View className={`pb-2 ${active ? 'border-b-2 border-primary' : ''}`}>
      <Text
        className={`text-sm font-semibold ${active ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
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
