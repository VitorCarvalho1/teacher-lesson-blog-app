import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/components/ui/Icon';

type AlertProps = {
  children: React.ReactNode;
  variant?: 'error' | 'success' | 'info';
};

export default function Alert({ children, variant = 'info' }: AlertProps) {
  const { colors, radius, spacing } = useTheme();

  const getTheme = () => {
    switch (variant) {
      case 'error':
        return {
          bg: colors.dangerSoft,
          border: colors.danger,
          text: colors.danger,
          icon: 'alert' as const,
        };
      case 'success':
        return {
          bg: colors.successSoft,
          border: colors.success,
          text: colors.success,
          icon: 'checkCircle' as const,
        };
      case 'info':
      default:
        return {
          bg: colors.primarySoft,
          border: colors.primary,
          text: colors.primary,
          icon: 'info' as const,
        };
    }
  };

  const theme = getTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.base,
        },
      ]}
    >
      <Icon name={theme.icon} size={18} color={theme.text} />
      <View style={styles.textWrap}>
        {typeof children === 'string' ? (
          <Text style={[styles.text, { color: theme.text }]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
  },
  textWrap: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
