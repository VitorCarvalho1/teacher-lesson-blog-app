import React, { useState, useMemo } from 'react';
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
import {
  formatIsoDateRange,
  getMonthCells,
  parseIsoDate,
  shiftMonth,
  toIsoDate,
} from '@/utils/iso-date';

export type DateRange = {
  from: string | null;
  to: string | null;
};

type DateRangePickerProps = {
  label: string;
  from: string | null;
  to: string | null;
  onChange: (range: DateRange) => void;
};

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const monthTitleFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

function formatMonthTitle(date: Date): string {
  const title = monthTitleFormatter.format(date);
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function orderedRange(start: string, end: string): DateRange {
  return start <= end ? { from: start, to: end } : { from: end, to: start };
}

export default function DateRangePicker({
  label,
  from,
  to,
  onChange,
}: DateRangePickerProps) {
  const { colors, radius } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [pickingEnd, setPickingEnd] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseIsoDate(from ?? '') ?? new Date());

  const todayIso = toIsoDate(new Date());
  const cells = useMemo(() => getMonthCells(viewDate), [viewDate]);
  const summary = formatIsoDateRange(from, to);
  const hasRange = Boolean(from || to);

  function handleDayPress(iso: string) {
    if (!pickingEnd || !from) {
      onChange({ from: iso, to: iso });
      setPickingEnd(true);
      return;
    }

    onChange(orderedRange(from, iso));
    setPickingEnd(false);
    setModalVisible(false);
  }

  function handleClear() {
    onChange({ from: null, to: null });
    setPickingEnd(false);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

      <View
        style={[
          styles.control,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setViewDate(parseIsoDate(from ?? '') ?? new Date());
            setPickingEnd(false);
            setModalVisible(true);
          }}
          style={styles.trigger}
        >
          <Text
            style={[
              styles.summaryText,
              { color: hasRange ? colors.text : colors.textMuted },
            ]}
          >
            {summary}
          </Text>
          <Icon name="calendar" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {hasRange ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClear}
            style={styles.clearBtn}
            accessibilityLabel="Limpar período"
          >
            <Icon name="close" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

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
              styles.modalCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.lg,
              },
            ]}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setViewDate((curr) => shiftMonth(curr, -1))}
                style={styles.navBtn}
              >
                <Icon name="chevronLeft" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.monthTitle, { color: colors.text }]}>
                {formatMonthTitle(viewDate)}
              </Text>
              <TouchableOpacity
                onPress={() => setViewDate((curr) => shiftMonth(curr, 1))}
                style={styles.navBtn}
              >
                <Icon name="chevronRight" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.hint, { color: colors.textMuted }]}>
              {pickingEnd
                ? 'Agora escolha a data final do período.'
                : 'Escolha o início e o fim do período.'}
            </Text>

            <View style={styles.weekdays}>
              {WEEKDAYS.map((w, idx) => (
                <Text
                  key={idx}
                  style={[styles.weekdayText, { color: colors.textMuted }]}
                >
                  {w}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {cells.map((iso, idx) => {
                if (!iso) {
                  return <View key={`empty-${idx}`} style={styles.dayCell} />;
                }

                const isStart = iso === from;
                const isEnd = iso === to;
                const isSelected = isStart || isEnd;
                const inRange = Boolean(
                  from && to && iso >= from && iso <= to
                );
                const isToday = iso === todayIso;

                return (
                  <TouchableOpacity
                    key={iso}
                    activeOpacity={0.7}
                    onPress={() => handleDayPress(iso)}
                    style={[
                      styles.dayCell,
                      inRange && !isSelected
                        ? { backgroundColor: colors.primarySoft }
                        : null,
                      isSelected
                        ? {
                            backgroundColor: colors.primary,
                            borderRadius: radius.sm,
                          }
                        : null,
                      isToday && !isSelected
                        ? {
                            borderWidth: 1,
                            borderColor: colors.accent,
                            borderRadius: radius.sm,
                          }
                        : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: isSelected
                            ? colors.onPrimary
                            : isToday
                            ? colors.accent
                            : colors.text,
                          fontWeight: isSelected || isToday ? '700' : '400',
                        },
                      ]}
                    >
                      {Number(iso.slice(-2))}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleClear}
                disabled={!hasRange}
                style={{ opacity: hasRange ? 1 : 0.4 }}
              >
                <Text style={{ color: colors.danger, fontWeight: '600' }}>
                  Limpar período
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  Concluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
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
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: 14,
  },
  clearBtn: {
    padding: 6,
    marginLeft: 6,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
});
