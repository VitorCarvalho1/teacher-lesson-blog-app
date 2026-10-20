import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Icon from '@/components/ui/Icon';

type AppHeaderProps = {
  title?: string;
  onOpenDrawer: () => void;
};

export default function AppHeader({ title, onOpenDrawer }: AppHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenDrawer}
          style={styles.menuBtn}
          accessibilityLabel="Abrir menu de navegação"
        >
          <Icon name="menu" size={22} color={colors.text} />
        </TouchableOpacity>
        <BrandLogo size="sm" showTagline={false} to="/posts" />
      </View>

      {title ? (
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : null}

      <View style={styles.right}>
        <ThemeToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBtn: {
    padding: 6,
    marginRight: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
