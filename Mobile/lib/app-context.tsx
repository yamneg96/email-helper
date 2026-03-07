import { mobileApi, UserProfile } from '@/lib/api';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface AppContextValue {
  token: string | null;
  user: UserProfile | null;
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  signIn: (email: string, name: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const signIn = async (email: string, name: string) => {
    const response = await mobileApi.login(email, name);
    setToken(response.token);
    setUser(response.user);
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) {
      return;
    }

    const response = await mobileApi.me(token);
    setUser(response.user);
  };

  const value = useMemo(
    () => ({ token, user, isOnline, setOnline: setIsOnline, signIn, signOut, refreshUser }),
    [token, user, isOnline]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppProvider.');
  }

  return context;
}
