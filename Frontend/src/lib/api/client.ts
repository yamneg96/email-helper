import type {
  ApiEnvelope,
  AppLanguage,
  EmailItem,
  InboxItem,
  TemplateItem,
  UserProfile,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";

const GOOGLE_FALLBACK_PASSWORD = "google-oauth-local-password";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const data = (await response.json()) as { message?: { en?: string } } & T;
  if (!response.ok) {
    throw new Error(data.message?.en || "Request failed.");
  }

  return data;
}

export const apiClient = {
  async loginWithGoogleLike(email: string, name: string) {
    return request<ApiEnvelope<never>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: GOOGLE_FALLBACK_PASSWORD,
        name,
      }),
    });
  },

  async getMe(token: string) {
    return request<ApiEnvelope<never>>("/auth/me", { method: "GET" }, token);
  },

  async logout(token?: string) {
    return request<ApiEnvelope<never>>(
      "/auth/logout",
      { method: "POST" },
      token,
    );
  },

  async fetchInbox(token: string) {
    return request<ApiEnvelope<InboxItem>>(
      "/email/inbox",
      { method: "GET" },
      token,
    );
  },

  async fetchSent(token: string) {
    return request<ApiEnvelope<EmailItem>>(
      "/email/sent",
      { method: "GET" },
      token,
    );
  },

  async sendEmail(
    token: string,
    payload: {
      to: string;
      subject: string;
      body: string;
      language: AppLanguage;
      attachments?: Array<{
        filename: string;
        mimeType: string;
        contentBase64: string;
      }>;
    },
  ) {
    return request<ApiEnvelope<EmailItem>>(
      "/email/send",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    );
  },

  async getTemplates(token: string) {
    return request<ApiEnvelope<TemplateItem>>(
      "/templates",
      { method: "GET" },
      token,
    );
  },

  async createTemplate(
    token: string,
    payload: Pick<TemplateItem, "name" | "subject" | "body" | "language">,
  ) {
    return request<ApiEnvelope<TemplateItem>>(
      "/templates",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    );
  },

  async updateTemplate(
    token: string,
    id: string,
    payload: Partial<
      Pick<TemplateItem, "name" | "subject" | "body" | "language">
    >,
  ) {
    return request<ApiEnvelope<TemplateItem>>(
      `/templates/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      token,
    );
  },

  async deleteTemplate(token: string, id: string) {
    return request<ApiEnvelope<never>>(
      `/templates/${id}`,
      {
        method: "DELETE",
      },
      token,
    );
  },

  async updateProfile(
    token: string,
    payload: Partial<Pick<UserProfile, "name" | "email">>,
  ) {
    return request<ApiEnvelope<never>>(
      "/user/profile",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      token,
    );
  },

  async updateSettings(
    token: string,
    payload: {
      language?: AppLanguage;
      theme?: "light" | "dark" | "system";
      onboardingStep?: number;
      onboardingCompleted?: boolean;
    },
  ) {
    return request<ApiEnvelope<never>>(
      "/user/settings",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};
