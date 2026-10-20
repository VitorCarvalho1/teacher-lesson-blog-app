import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Icon from '@/components/ui/Icon';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topToolbar}>
          <BrandLogo size="sm" showTagline={false} />
          <ThemeToggle />
        </View>

        <View style={styles.heroCard}>
          <BrandLogo size="lg" showTagline={true} />
          <Text style={[styles.headline, { color: colors.text }]}>
            Onde aulas viram conhecimento compartilhado.
          </Text>
          <Text style={[styles.lead, { color: colors.textMuted }]}>
            Um espaço acadêmico para docentes e estudantes publicarem, lerem e
            acompanharem lições com clareza.
          </Text>

          <View style={styles.highlights}>
            <View style={styles.highlightItem}>
              <Icon name="checkCircle" size={16} color={colors.primary} />
              <Text style={[styles.highlightText, { color: colors.text }]}>
                Publicações pensadas para sala de aula
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Icon name="checkCircle" size={16} color={colors.primary} />
              <Text style={[styles.highlightText, { color: colors.text }]}>
                Acesso autenticado para a comunidade
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Icon name="checkCircle" size={16} color={colors.primary} />
              <Text style={[styles.highlightText, { color: colors.text }]}>
                Leitura confortável no claro e no escuro
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.lg,
              padding: spacing.lg,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>

          <View style={styles.formWrap}>{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  topToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroCard: {
    marginBottom: 24,
    gap: 12,
  },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 28,
    marginTop: 6,
  },
  lead: {
    fontSize: 14,
    lineHeight: 22,
  },
  highlights: {
    gap: 8,
    marginTop: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '500',
  },
  card: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 20,
  },
  formWrap: {
    width: '100%',
  },
});
