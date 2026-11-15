import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getBaseApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, '');
  }

  // Running on Web
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  // Metro hostUri is available whenever connected to Expo CLI (emulators and physical devices)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;
  }

  // Running on Android Emulator (fallback if hostUri is not available)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  // Running on iOS Simulator or other native platforms
  return 'http://localhost:3000';
}

export const API_BASE_URL = getBaseApiUrl();
