import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authApi from '@/api/auth.api';
import { setUnauthorizedHandler } from '@/api/http-client';
import type { LoginPayload, RegisterPayload, User } from '@/types/auth';
import {
  clearSession,
  loadSession,
  saveSession,
  updateStoredUser,
} from '@/utils/auth-storage';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (fields: Partial<User>) => void;
  updateSessionUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const resetSession = useCallback(async () => {
    await clearSession();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    loadSession().then((session) => {
      if (!mounted) return;
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
      setIsLoading(false);
    });

    setUnauthorizedHandler(resetSession);
    return () => {
      mounted = false;
      setUnauthorizedHandler(null);
    };
  }, [resetSession]);

  const login = useCallback(async (payload: LoginPayload): Promise<User> => {
    const response = await authApi.login(payload);
    const session = {
      user: response.data.user,
      token: response.data.token,
    };

    await saveSession(session, payload.rememberMe);
    setUser(session.user);
    setToken(session.token);
    return session.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    await authApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      //
    } finally {
      await resetSession();
    }
  }, [resetSession]);

  const updateSessionUser = useCallback(async (nextUser: User) => {
    setUser(nextUser);
    await updateStoredUser(nextUser);
  }, []);

  const updateUser = useCallback(
    (fields: Partial<User>) => {
      if (user) {
        const next = { ...user, ...fields, updated_at: new Date().toISOString() };
        updateSessionUser(next);
      }
    },
    [user, updateSessionUser]
  );

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === 'ADMIN';

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      updateSessionUser,
    }),
    [
      user,
      token,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      updateSessionUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
