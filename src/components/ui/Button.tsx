import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  const { colors, radius, spacing } = useTheme();

  const getContainerStyles = (): ViewStyle => {
    switch (variant) {
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
          borderWidth: 1,
          borderColor: colors.danger,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          borderWidth: 1,
          borderColor: colors.primary,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    switch (variant) {
      case 'ghost':
        return {
          color: colors.text,
        };
      case 'danger':
        return {
          color: '#ffffff',
        };
      case 'primary':
      default:
        return {
          color: colors.onPrimary,
        };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        {
          borderRadius: radius.md,
          paddingHorizontal: spacing.base,
          opacity: disabled ? 0.6 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        getContainerStyles(),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? colors.text : '#ffffff'}
          style={styles.spinner}
        />
      ) : null}
      <Text style={[styles.text, getTextStyles(), textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
