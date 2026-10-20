import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import AppHeader from '@/components/layout/AppHeader';
import BottomTabBar from '@/components/layout/BottomTabBar';
import MobileDrawer from '@/components/layout/MobileDrawer';
import AppFooter from '@/components/layout/AppFooter';

type AppLayoutProps = {
  children: React.ReactNode;
  title?: string;
  scrollable?: boolean;
};

export default function AppLayout({
  children,
  title,
  scrollable = true,
}: AppLayoutProps) {
  const { colors } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
    >
      <AppHeader
        title={title}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrap}>{children}</View>
          <AppFooter />
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>
          <View style={styles.contentWrap}>{children}</View>
          <AppFooter />
        </View>
      )}

      <BottomTabBar onOpenDrawer={() => setDrawerOpen(true)} />

      <MobileDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fixedContent: {
    flex: 1,
  },
  contentWrap: {
    flex: 1,
    padding: 16,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
});
