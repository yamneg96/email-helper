import { Text } from '@/components/ui/text';
import { router, usePathname } from 'expo-router';
import { Inbox, LayoutGrid, Send, Settings, SquarePen, Files } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

const ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { path: '/inbox', label: 'Inbox', icon: Inbox },
  { path: '/compose', label: 'Compose', icon: SquarePen },
  { path: '/templates', label: 'Templates', icon: Files },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/sent', label: 'Sent', icon: Send },
];

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <View className="border-t border-border bg-card px-2 py-2">
      <View className="flex-row flex-wrap justify-between">
        {ITEMS.map((item) => {
          const active = pathname === item.path;
          return (
            <Pressable
              key={item.path}
              className="w-1/3 py-2 items-center"
              onPress={() => router.replace(item.path as never)}>
              <item.icon color={active ? 'hsl(221 83% 53%)' : 'gray'} size={18} />
              <Text className={`text-[10px] ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
