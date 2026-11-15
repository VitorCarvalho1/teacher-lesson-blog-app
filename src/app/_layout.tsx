import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function RootNavigator() {
  const { isDark, colors } = useTheme();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const firstSegment = segments[0] as string | undefined;
    const secondSegment = segments[1] as string | undefined;
    const thirdSegment = segments[2] as string | undefined;

    const inAuthScreen = firstSegment === 'login' || firstSegment === 'register';

    if (!isAuthenticated && !inAuthScreen) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthScreen) {
      router.replace(isAdmin ? '/' : '/posts');
    } else if (isAuthenticated && !isAdmin) {
      // RoleRoute protection for members: members cannot access admin-only screens
      const isRootAdmin = !firstSegment || firstSegment === 'index';
      const isUsersRoute = firstSegment === 'users';
      const isNewPost = firstSegment === 'posts' && secondSegment === 'new';
      const isEditPost = firstSegment === 'posts' && thirdSegment === 'edit';

      if (isRootAdmin || isUsersRoute || isNewPost || isEditPost) {
        router.replace('/posts');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
