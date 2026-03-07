import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { mobileApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  Bell,
  CalendarDays,
  FileText,
  Grid3X3,
  Inbox,
  Search,
  Send,
  SquarePen,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Pressable, ScrollView, View } from 'react-native';

export default function DashboardScreen() {
  const { user, token } = useAppState();

  const inboxQuery = useQuery({
    queryKey: ['mobile-inbox', token],
    queryFn: () => mobileApi.inbox(token as string),
    enabled: Boolean(token),
  });

  const inboxCount = inboxQuery.data?.items?.length || 0;
  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AR';

  const activityCards = [
    {
      name: inboxQuery.data?.items?.[0]?.sender || 'Sarah Jenkins',
      detail:
        inboxQuery.data?.items?.[0]?.subject || 'Project Update: Design Review for Mobile app',
      time: '10:45 AM',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAjhKy8xnrFwh9k6xEfJjqNQlGxORZS0m1b1M36kYpiH-ukebZwyF49YLZnHd38IHa3jLBZM0rZlah--gizsNur4-uRHMsjjhirL7lep0nRfj6J1mS3E6bHzQvkeyQ7gBlFx9GAW3yUflJ-p0RxoUpyUjCnJgVLkgWPlwm54YeOzVFaUPwE8v-DGYHdKPKvt8XE9KLJLDUY6zHYV3Dq0fVuQg0xBD-L0DsMg1urVhHv5FOuVbCSruSBej1-b87NV0WDEgYTlhoLJS4',
      faded: false,
    },
    {
      name: inboxQuery.data?.items?.[1]?.sender || 'Mark Thompson',
      detail: inboxQuery.data?.items?.[1]?.subject || 'Welcome to the new dashboard interface!',
      time: 'Yesterday',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAVxv6tpxVEgSNSTTmv1EBx6Wd30WgrqMssrEOv5JaD9Whn9dctVxM-nrlXGtkILq0XJxVB6ASEnZZvk7nVDPq2IJz_hpek6OY5HehriffTOi-6QHAyj6fZPE2S8qjplKIAr1eKZHQHVk-3aOr4guLHsUCrVQI60WbDbLazKJ-yKpvhL-TjuA-_Aj17RLFUxjPZZ-f_8SVaBM74ybWAr2sq-vcY3SRvrtAh0SlUNyIJ4cWOxRUt92AU9vn9Or7PycjFCsKMvatfwnY',
      faded: true,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="mx-auto w-full max-w-md flex-1 bg-white dark:bg-slate-900">
        <View className="flex-row items-center justify-between border-b border-slate-100 bg-white p-6 pt-8 dark:border-slate-800 dark:bg-slate-900">
          <View>
            <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Good morning,
            </Text>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              {user?.name || 'Alex Rivera'}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable className="relative rounded-full p-2">
              <Bell color="hsl(215 25% 40%)" size={24} />
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
            </Pressable>
            <View className="size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <Text className="text-sm font-bold text-primary">{initials}</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 16 }}>
          <View>
            <View className="mb-4 flex-1 items-center justify-between">
              <Text className="text-lg font-semibold tracking-tight">Main Actions</Text>
            </View>

            <View className="flex-1 flex-row flex-wrap gap-4">
              <ActionCard
                label="Compose"
                subtitle="New message"
                icon={SquarePen}
                primary
                onPress={() => router.push('/compose')}
              />
              <ActionCard
                label="Inbox"
                subtitle="View latest"
                icon={Inbox}
                badge={inboxCount > 0 ? String(inboxCount) : '0'}
                onPress={() => router.push('/inbox')}
              />
              <ActionCard
                label="Templates"
                subtitle="Saved drafts"
                icon={FileText}
                onPress={() => router.push('/templates')}
              />
              <ActionCard
                label="Sent"
                subtitle="Outbox history"
                icon={Send}
                onPress={() => router.push('/sent')}
              />
            </View>
          </View>

          <View className="mt-8">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold tracking-tight">Recent Activity</Text>
              <Pressable onPress={() => router.push('/inbox')}>
                <Text className="text-sm font-semibold text-primary">View all</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {activityCards.map((item) => (
                <View
                  key={`${item.name}-${item.time}`}
                  className={`flex-row items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 ${
                    item.faded ? 'opacity-60' : ''
                  }`}>
                  <View className="size-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <Image className="h-full w-full" source={{ uri: item.image }} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between">
                      <Text className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </Text>
                      <Text className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {item.time}
                      </Text>
                    </View>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      {item.detail}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="border-t border-slate-100 bg-white/80 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <View className="mx-auto flex w-full max-w-sm flex-row items-center justify-between">
            <BottomItem
              label="Dashboard"
              icon={Grid3X3}
              active
              onPress={() => router.replace('/dashboard')}
            />
            <BottomItem label="Search" icon={Search} onPress={() => router.replace('/inbox')} />
            <BottomItem
              label="Events"
              icon={CalendarDays}
              onPress={() => router.replace('/sent')}
            />
            <BottomItem
              label="Settings"
              icon={FileText}
              onPress={() => router.replace('/settings')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ActionCard({
  label,
  subtitle,
  icon: Icon,
  onPress,
  primary,
  badge,
}: {
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  onPress: () => void;
  primary?: boolean;
  badge?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-36 w-[48%] rounded-xl p-5 ${
        primary
          ? 'bg-primary shadow-lg shadow-primary/20'
          : 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}>
      <View className={`w-12 rounded-lg p-3 ${primary ? 'bg-white/20' : 'bg-primary/10'}`}>
        <Icon color={primary ? 'white' : 'hsl(221 83% 53%)'} size={20} />
      </View>
      <View className="mt-4">
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-lg font-bold ${primary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {label}
          </Text>
          {badge ? (
            <Text className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">
              {badge}
            </Text>
          ) : null}
        </View>
        <Text
          className={`text-sm ${primary ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

function BottomItem({
  label,
  icon: Icon,
  onPress,
  active,
}: {
  label: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable className="items-center gap-1" onPress={onPress}>
      <Icon color={active ? 'hsl(221 83% 53%)' : 'hsl(215 16% 47%)'} size={18} />
      <Text
        className={`text-[10px] uppercase tracking-wider ${active ? 'font-bold text-primary' : 'text-slate-400'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
