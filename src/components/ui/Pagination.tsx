import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/components/ui/Icon';
import { getPageItems, getRangeLabel } from '@/utils/pagination';

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  disabled = false,
  onPageChange,
}: PaginationProps) {
  const { colors, radius } = useTheme();

  if (total === 0 && totalPages <= 1) {
    return null;
  }

  const current = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const items = getPageItems(current, totalPages);
  const atStart = current <= 1;
  const atEnd = current >= totalPages;

  return (
    <View style={styles.container}>
      <Text style={[styles.summary, { color: colors.textMuted }]}>
        {getRangeLabel(current, limit, total)}
      </Text>

      {totalPages > 1 ? (
        <View style={styles.controls}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled || atStart}
            onPress={() => onPageChange(current - 1)}
            style={[
              styles.navBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.md,
                opacity: disabled || atStart ? 0.4 : 1,
              },
            ]}
          >
            <Icon name="chevronLeft" size={16} color={colors.text} />
            <Text style={[styles.navText, { color: colors.text }]}>Anterior</Text>
          </TouchableOpacity>

          <View style={styles.pagesList}>
            {items.map((item, index) => {
              if (item === 'ellipsis') {
                return (
                  <Text
                    key={`ellipsis-${index}`}
                    style={[styles.ellipsis, { color: colors.textMuted }]}
                  >
                    …
                  </Text>
                );
              }

              const isCurrent = item === current;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  disabled={disabled}
                  onPress={() => onPageChange(item)}
                  style={[
                    styles.pageBtn,
                    {
                      borderRadius: radius.sm,
                      backgroundColor: isCurrent ? colors.primary : 'transparent',
                      borderColor: isCurrent ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pageText,
                      {
                        color: isCurrent ? colors.onPrimary : colors.text,
                        fontWeight: isCurrent ? '700' : '500',
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled || atEnd}
            onPress={() => onPageChange(current + 1)}
            style={[
              styles.navBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.md,
                opacity: disabled || atEnd ? 0.4 : 1,
              },
            ]}
          >
            <Text style={[styles.navText, { color: colors.text }]}>Próxima</Text>
            <Icon name="chevronRight" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    gap: 12,
  },
  summary: {
    fontSize: 13,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 36,
    gap: 4,
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pagesList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageBtn: {
    width: 34,
    height: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageText: {
    fontSize: 13,
  },
  ellipsis: {
    paddingHorizontal: 4,
    fontSize: 14,
  },
});
