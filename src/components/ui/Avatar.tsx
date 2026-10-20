import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserRole } from '@/types/auth';
import { getInitials } from '@/utils/user-display';
import { useTheme } from '@/context/ThemeContext';

type AvatarProps = {
  name: string;
  role?: UserRole;
  size?: 'sm' | 'md' | 'lg';
};

export default function Avatar({ name, role = 'USER', size = 'md' }: AvatarProps) {
  const { colors } = useTheme();

  const dimension = size === 'lg' ? 52 : size === 'sm' ? 34 : 42;
  const fontSize = size === 'lg' ? 18 : size === 'sm' ? 12 : 15;

  const isAdmin = role === 'ADMIN';
  const bgColor = isAdmin ? colors.accentSoft : colors.primarySoft;
  const textColor = isAdmin ? colors.accent : colors.primary;
  const borderColor = isAdmin ? colors.accent : colors.border;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize, color: textColor }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
