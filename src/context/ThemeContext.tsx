import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  DarkThemeColors,
  LightThemeColors,
  Radius,
  Spacing,
  ThemeColors,
  ThemeMode,
  Typography,
} from '@/theme/tokens';

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof Spacing;
  radius: typeof Radius;
  typography: typeof Typography;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<ThemeMode | null>(null);

  const theme: ThemeMode =
    userTheme ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = React.useCallback(() => {
    setUserTheme((prev) => {
      const current = prev ?? (systemScheme === 'dark' ? 'dark' : 'light');
      return current === 'light' ? 'dark' : 'light';
    });
  }, [systemScheme]);

  const setTheme = React.useCallback((nextTheme: ThemeMode) => {
    setUserTheme(nextTheme);
  }, []);

  const isDark = theme === 'dark';
  const colors = isDark ? DarkThemeColors : LightThemeColors;

  const value = useMemo(
    () => ({
      theme,
      isDark,
      colors,
      spacing: Spacing,
      radius: Radius,
      typography: Typography,
      toggleTheme,
      setTheme,
    }),
    [theme, isDark, colors, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
