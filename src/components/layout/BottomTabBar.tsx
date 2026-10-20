import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Icon, { IconName } from '@/components/ui/Icon';

type BottomTabBarProps = {
  onOpenDrawer: () => void;
};

type Tab = {
  to?: string;
  label: string;
  icon: IconName;
  action?: 'drawer';
  adminOnly?: boolean;
};

export default function BottomTabBar({ onOpenDrawer }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const { isAdmin } = useAuth();

  const tabs: Tab[] = [
    ...(isAdmin
      ? ([{ to: '/', label: 'Início', icon: 'home', adminOnly: true }] as Tab[])
      : []),
    { to: '/posts', label: 'Postagens', icon: 'posts' },
    ...(isAdmin
      ? ([
          { to: '/posts/new', label: 'Nova aula', icon: 'write', adminOnly: true },
          { to: '/users', label: 'Comunidade', icon: 'users', adminOnly: true },
        ] as Tab[])
      : []),
    { label: 'Menu', icon: 'menu', action: 'drawer' },
  ];

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      {tabs.map((tab, idx) => {
        const isActive =
          tab.to &&
          (tab.to === '/'
            ? pathname === '/'
            : pathname === tab.to || (tab.to !== '/' && pathname.startsWith(tab.to)));

        return (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.7}
            onPress={() => {
              if (tab.action === 'drawer') {
                onOpenDrawer();
              } else if (tab.to) {
                router.push(tab.to as any);
              }
            }}
            style={styles.tabItem}
            accessibilityLabel={tab.label}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? colors.primary : colors.textMuted,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
  },
});
