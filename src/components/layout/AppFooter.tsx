import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function AppFooter() {
  const { colors, spacing } = useTheme();
  const year = new Date().getFullYear();

  return (
    <View
      style={[
        styles.footer,
        {
          borderTopColor: colors.border,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.base,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.textMuted }]}>
        © {year} Portal Acadêmico — espaço de postagens para docentes e estudantes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 80, // Space for bottom tab bar
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
