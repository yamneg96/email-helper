import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppState } from '@/lib/app-context';
import { AppLanguage, mobileApi } from '@/lib/api';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ComposeScreen() {
  const { token, user } = useAppState();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    if (!token) {
      return;
    }

    setSending(true);
    setStatus('');
    try {
      await mobileApi.sendEmail(token, {
        to,
        subject,
        body,
        language: (user?.language || 'en') as AppLanguage,
      });
      setTo('');
      setSubject('');
      setBody('');
      setStatus('Email sent successfully. / ኢሜይል ተልኳል።');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f6f8] dark:bg-[#101622]">
      <View className="mx-auto w-full max-w-2xl flex-1 bg-white dark:bg-slate-900">
        <View className="flex-row items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <View className="flex-row items-center gap-3">
            <Pressable className="rounded-lg p-2">
              <Text className="text-slate-600 dark:text-slate-400">✕</Text>
            </Pressable>
            <Text className="text-lg font-semibold">ኢሜይል ይጻፉ (Compose)</Text>
          </View>
          <Pressable className="rounded-lg p-2">
            <Text className="text-slate-600 dark:text-slate-400">⋮</Text>
          </Pressable>
        </View>

        <View className="flex-1 gap-6 p-4 md:p-6">
          <FieldLabel label="ለማን (To)" />
          <TextInput
            className="mb-3 h-11 rounded-lg border border-border bg-background px-3 text-foreground"
            placeholder="To"
            placeholderTextColor="gray"
            keyboardType="email-address"
            value={to}
            onChangeText={setTo}
          />
          <FieldLabel label="ርዕስ (Subject)" />
          <TextInput
            className="mb-3 h-11 rounded-lg border border-border bg-background px-3 text-foreground"
            placeholder="Subject"
            placeholderTextColor="gray"
            value={subject}
            onChangeText={setSubject}
          />
          <FieldLabel label="መልእክት (Message)" />
          <TextInput
            className="min-h-[240px] rounded-lg border border-border bg-background px-3 py-3 text-foreground"
            placeholder="Message"
            placeholderTextColor="gray"
            multiline
            textAlignVertical="top"
            value={body}
            onChangeText={setBody}
          />
          {status ? <Text className="mt-2 text-sm text-primary">{status}</Text> : null}
        </View>

        <View className="border-t border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <View className="flex-row gap-3">
            <Button className="h-12 flex-1" variant="outline">
              <Text>ፋይል አክል (Attach File)</Text>
            </Button>
            <Button className="h-12 flex-1" onPress={onSend}>
              <Text className="font-bold text-primary-foreground">
                {sending ? 'Sending...' : 'ላክ (Send)'}
              </Text>
            </Button>
          </View>
          <View className="mt-4 flex-row items-center justify-center gap-6">
            <Text className="text-slate-400">B</Text>
            <Text className="text-slate-400">I</Text>
            <Text className="text-slate-400">🔗</Text>
            <Text className="text-slate-400">🖼</Text>
            <Text className="text-red-500">🗑</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <Text className="-mb-1 text-sm font-medium">{label}</Text>;
}
