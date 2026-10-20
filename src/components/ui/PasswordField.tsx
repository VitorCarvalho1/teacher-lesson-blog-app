import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import TextField from '@/components/ui/TextField';
import Icon from '@/components/ui/Icon';
import { useTheme } from '@/context/ThemeContext';

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

export default function PasswordField({
  label,
  value,
  onChangeText,
  error,
  hint,
  placeholder,
  disabled = false,
  required = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      hint={hint}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      secureTextEntry={!visible}
      autoCapitalize="none"
      trailing={
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setVisible((prev) => !prev)}
          style={styles.toggle}
          accessibilityLabel={visible ? 'Ocultar senha' : 'Exibir senha'}
        >
          <Icon
            name={visible ? 'eyeOff' : 'eye'}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  toggle: {
    padding: 6,
  },
});
