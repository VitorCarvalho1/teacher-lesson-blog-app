import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/components/ui/Icon';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  const { colors, radius } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[styles.container, { opacity: disabled ? 0.6 : 1 }]}
    >
      <View
        style={[
          styles.box,
          {
            borderRadius: radius.sm,
            borderColor: checked ? colors.primary : colors.border,
            backgroundColor: checked ? colors.primary : colors.surface,
          },
        ]}
      >
        {checked ? <Icon name="check" size={14} color={colors.onPrimary} /> : null}
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
});
