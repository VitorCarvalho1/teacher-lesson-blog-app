import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { AuthSession, User } from '@/types/auth';

const TOKEN_KEY = 'academic-portal-token';
const USER_KEY = 'academic-portal-user';
const PERSIST_KEY = 'academic-portal-persist';

let cachedSession: AuthSession | null = null;

function readUser(raw: string | null): User | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    //
  }
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    //
  }
}

export async function loadSession(): Promise<AuthSession | null> {
  try {
    const token = await getItem(TOKEN_KEY);
    const rawUser = await getItem(USER_KEY);
    const user = readUser(rawUser);

    if (!token || !user) {
      cachedSession = null;
      return null;
    }

    cachedSession = { token, user };
    return cachedSession;
  } catch {
    cachedSession = null;
    return null;
  }
}

export function getCachedSession(): AuthSession | null {
  return cachedSession;
}

export async function saveSession(session: AuthSession, persist: boolean = true): Promise<void> {
  cachedSession = session;
  await setItem(PERSIST_KEY, persist ? '1' : '0');
  await setItem(TOKEN_KEY, session.token);
  await setItem(USER_KEY, JSON.stringify(session.user));
}

export async function clearSession(): Promise<void> {
  cachedSession = null;
  await removeItem(TOKEN_KEY);
  await removeItem(USER_KEY);
  await removeItem(PERSIST_KEY);
}

export async function getStoredToken(): Promise<string | null> {
  if (cachedSession?.token) {
    return cachedSession.token;
  }
  return await getItem(TOKEN_KEY);
}

export async function updateStoredUser(user: User): Promise<void> {
  if (cachedSession) {
    cachedSession = { ...cachedSession, user };
  }
  await setItem(USER_KEY, JSON.stringify(user));
}

