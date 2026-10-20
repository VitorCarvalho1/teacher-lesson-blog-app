import React, { createContext, useContext, useState, useMemo } from 'react';
import { User, UserRole, LoginPayload, RegisterPayload } from '@/types/auth';
import { INITIAL_USERS } from '@/mock/mockData';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  switchRole: () => void;
  updateUser: (fields: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Admin user for full layout exploration, with easy toggle
  const [user, setUser] = useState<User | null>(INITIAL_USERS[0]);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'ADMIN';

  const login = async (payload: LoginPayload): Promise<User> => {
    // Mock login
    const found = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );
    const sessionUser: User = found ?? {
      id: Date.now(),
      name: payload.email.split('@')[0],
      email: payload.email,
      role: 'USER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(sessionUser);
    return sessionUser;
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    const newUser: User = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: 'USER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = React.useCallback(() => {
    if (!user) {
      setUser(INITIAL_USERS[0]);
      return;
    }
    const nextRole: UserRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setUser({
      ...user,
      role: nextRole,
      name: nextRole === 'ADMIN' ? 'Prof. Henrique Viana' : 'Lucas Albuquerque',
      email: nextRole === 'ADMIN' ? 'henrique.viana@escola.edu.br' : 'lucas.albuquerque@aluno.escola.edu.br',
    });
  }, [user]);

  const updateUser = React.useCallback((fields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...fields, updated_at: new Date().toISOString() });
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      switchRole,
      updateUser,
    }),
    [user, isAuthenticated, isAdmin, switchRole, updateUser]
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
