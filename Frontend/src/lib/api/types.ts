export type AppLanguage = "en" | "am";
export type AppTheme = "light" | "dark" | "system";

export interface BilingualMessage {
  en: string;
  am: string;
}

export interface ApiEnvelope<T> {
  message: BilingualMessage;
  token?: string;
  user?: UserProfile;
  items?: T[];
  template?: T;
  email?: T;
  settings?: unknown;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  language: AppLanguage;
  theme: AppTheme;
  onboarding: {
    step: number;
    completed: boolean;
  };
}

export interface AttachmentMetadata {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId?: string;
}

export interface InboxItem {
  messageId: string;
  threadId: string;
  sender: string;
  recipient: string;
  subject: string;
  snippet: string;
  attachments?: AttachmentMetadata[];
}

export interface EmailItem {
  _id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  status: "sent" | "received";
  createdAt: string;
  attachments?: AttachmentMetadata[];
}

export interface TemplateItem {
  _id: string;
  name: string;
  subject: string;
  body: string;
  language: AppLanguage;
  createdAt: string;
}
