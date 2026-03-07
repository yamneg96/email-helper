import { apiClient } from "@/lib/api/client";
import type { AppLanguage, UserProfile } from "@/lib/api/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextValue {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
}

const TOKEN_KEY = "email_helper_token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async (): Promise<void> => {
    if (!token) {
      setUser(null);
      return;
    }

    const response = await apiClient.getMe(token);
    if (response.user) {
      setUser(response.user);
    }
  };

  const signIn = async (email: string, name: string): Promise<void> => {
    const response = await apiClient.loginWithGoogleLike(email, name);
    if (!response.token || !response.user) {
      throw new Error("Login response is incomplete.");
    }

    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const signOut = async (): Promise<void> => {
    if (token) {
      await apiClient.logout(token);
    }

    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const setLanguage = async (language: AppLanguage): Promise<void> => {
    if (!token || !user) {
      return;
    }

    await apiClient.updateSettings(token, { language });
    setUser({ ...user, language });
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshUser();
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, signIn, signOut, refreshUser, setLanguage }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
