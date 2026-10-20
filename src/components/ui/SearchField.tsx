import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/components/ui/Icon';

type SearchFieldProps = {
  label?: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
};

export default function SearchField({
  label,
  value,
  placeholder = 'Buscar...',
  onChangeText,
  onSubmit,
  disabled = false,
}: SearchFieldProps) {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.control,
          {
            backgroundColor: disabled ? colors.surfaceMuted : colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        <Icon name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          editable={!disabled}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onChangeText('')}
            style={styles.clearBtn}
            accessibilityLabel="Limpar busca"
          >
            <Icon name="close" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  control: {
    height: 44,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 6,
  },
});
