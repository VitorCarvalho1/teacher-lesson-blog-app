import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/components/ui/Icon';

type Option = {
  label: string;
  value: string;
  hint?: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  hint?: string;
  error?: string;
  disabled?: boolean;
};

export default function SelectField({
  label,
  value,
  onValueChange,
  options,
  hint,
  error,
  disabled = false,
}: SelectFieldProps) {
  const { colors, radius } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value) ?? options[0];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => setModalVisible(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: disabled ? colors.surfaceMuted : colors.surface,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        <Text style={[styles.triggerText, { color: colors.text }]}>
          {selectedOption ? selectedOption.label : 'Selecione'}
        </Text>
        <Icon name="chevronRight" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      {hint && !error ? (
        <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text>
      ) : null}

      {error ? (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      ) : null}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.lg,
              },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                {label}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionList}>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    activeOpacity={0.7}
                    onPress={() => {
                      onValueChange(opt.value);
                      setModalVisible(false);
                    }}
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: isSelected
                          ? colors.primarySoft
                          : 'transparent',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.optionCopy}>
                      <Text
                        style={[
                          styles.optionLabel,
                          {
                            color: isSelected ? colors.primary : colors.text,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {opt.hint ? (
                        <Text
                          style={[
                            styles.optionHint,
                            { color: colors.textMuted },
                          ]}
                        >
                          {opt.hint}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected ? (
                      <Icon name="check" size={18} color={colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  trigger: {
    height: 44,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  triggerText: {
    fontSize: 15,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  sheet: {
    borderWidth: 1,
    padding: 20,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  optionList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  optionCopy: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
  },
  optionHint: {
    fontSize: 12,
    marginTop: 2,
  },
});
