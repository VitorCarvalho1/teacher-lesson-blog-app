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
  size?: 'sm' | 'md';
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
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  const { colors, radius, spacing } = useTheme();
  const isSm = size === 'sm';

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
          borderRadius: isSm ? radius.sm : radius.md,
          paddingHorizontal: isSm ? spacing.sm : spacing.base,
          paddingVertical: isSm ? 0 : 10,
          height: isSm ? 32 : 44,
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
          style={isSm ? styles.spinnerSm : styles.spinner}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          isSm && styles.textSm,
          getTextStyles(),
          textStyle,
        ]}
      >
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
  spinnerSm: {
    marginRight: 6,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  textSm: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
