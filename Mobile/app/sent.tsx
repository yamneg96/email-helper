import AppBottomNav from '@/components/app-bottom-nav';
import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { mobileApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

export default function SentScreen() {
  const { token } = useAppState();

  const sentQuery = useQuery({
    queryKey: ['mobile-sent', token],
    queryFn: () => mobileApi.sent(token as string),
    enabled: Boolean(token),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-3">
        <Text className="text-2xl font-extrabold">Sent | የተላኩ</Text>
        <ScrollView className="mt-3" contentContainerStyle={{ gap: 10, paddingBottom: 20 }}>
          {sentQuery.data?.items?.map((item) => (
            <View key={item._id} className="rounded-xl border border-border bg-card p-4">
              <Text className="font-bold">To: {item.recipient}</Text>
              <Text className="text-sm text-primary">{item.subject}</Text>
              <Text className="mt-1 text-sm text-muted-foreground">{item.body}</Text>
            </View>
          ))}
          {!sentQuery.data?.items?.length ? (
            <Text className="text-sm text-muted-foreground">No sent emails yet.</Text>
          ) : null}
        </ScrollView>
      </View>
      <AppBottomNav />
    </SafeAreaView>
  );
}
