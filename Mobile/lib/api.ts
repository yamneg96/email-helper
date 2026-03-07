import Constants from 'expo-constants';

export type AppLanguage = 'en' | 'am';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  language: AppLanguage;
  theme: 'light' | 'dark' | 'system';
  onboarding: {
    step: number;
    completed: boolean;
  };
}

export interface InboxItem {
  messageId: string;
  threadId: string;
  sender: string;
  recipient: string;
  subject: string;
  snippet: string;
}

export interface TemplateItem {
  _id: string;
  name: string;
  subject: string;
  body: string;
  language: AppLanguage;
}

export interface SentItem {
  _id: string;
  recipient: string;
  subject: string;
  body: string;
}

const inferredHost =
  typeof Constants.expoConfig?.hostUri === 'string'
    ? Constants.expoConfig.hostUri.split(':')[0]
    : 'localhost';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || `http://${inferredHost}:5000/api`;

const AUTH_PASSWORD = 'google-oauth-local-password';

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  const data = (await response.json()) as { message?: { en?: string } } & T;
  if (!response.ok) {
    throw new Error(data.message?.en || 'Request failed.');
  }

  return data;
}

export const mobileApi = {
  baseUrl: API_BASE_URL,

  login: (email: string, name: string) =>
    request<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, name, password: AUTH_PASSWORD }),
    }),

  me: (token: string) => request<{ user: UserProfile }>('/auth/me', { method: 'GET' }, token),

  updateSettings: (
    token: string,
    payload: {
      language?: AppLanguage;
      theme?: 'light' | 'dark' | 'system';
      onboardingStep?: number;
      onboardingCompleted?: boolean;
    }
  ) =>
    request(
      '/user/settings',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token
    ),

  inbox: (token: string) =>
    request<{ items: InboxItem[] }>('/email/inbox', { method: 'GET' }, token),

  sent: (token: string) => request<{ items: SentItem[] }>('/email/sent', { method: 'GET' }, token),

  templates: (token: string) =>
    request<{ items: TemplateItem[] }>('/templates', { method: 'GET' }, token),

  createTemplate: (
    token: string,
    payload: { name: string; subject: string; body: string; language: AppLanguage }
  ) =>
    request(
      '/templates',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token
    ),

  sendEmail: (
    token: string,
    payload: { to: string; subject: string; body: string; language: AppLanguage }
  ) =>
    request(
      '/email/send',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token
    ),
};
