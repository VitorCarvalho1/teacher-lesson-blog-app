import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { listPosts } from '@/api/posts.api';
import { listUsers } from '@/api/users.api';
import AppLayout from '@/components/layout/AppLayout';
import Icon, { IconName } from '@/components/ui/Icon';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getFirstName } from '@/utils/user-display';

type Shortcut = {
  to: string;
  label: string;
  description: string;
  icon: IconName;
};

const SHORTCUTS: Shortcut[] = [
  {
    to: '/posts',
    label: 'Postagens',
    description: 'Aulas publicadas pela comunidade',
    icon: 'posts',
  },
  {
    to: '/posts/new',
    label: 'Nova aula',
    description: 'Publicar uma nova lição',
    icon: 'write',
  },
  {
    to: '/users',
    label: 'Comunidade',
    description: 'Docentes e estudantes cadastrados',
    icon: 'users',
  },
  {
    to: '/users/new',
    label: 'Nova pessoa',
    description: 'Cadastrar docente ou estudante',
    icon: 'plus',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();
  const { colors, radius, spacing } = useTheme();

  const [postsCount, setPostsCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.replace('/posts');
      return;
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      listPosts({ limit: 1 })
        .then((res) => setPostsCount(res.meta.total))
        .catch(() => {});

      listUsers({ limit: 1 })
        .then((res) => setUsersCount(res.meta.total))
        .catch(() => {});
    }
  }, [isAdmin]);

  if (isLoading || !user || !isAdmin) {
    return (
      <AppLayout title="Início">
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AppLayout>
    );
  }

  const firstName = getFirstName(user);

  return (
    <AppLayout title="Início">
      <View style={styles.container}>
        <Text style={[styles.kicker, { color: colors.accent }]}>
          Painel do administrador
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Olá, {firstName}
        </Text>
        <Text style={[styles.intro, { color: colors.textMuted }]}>
          Você entrou como{' '}
          <Text style={{ fontWeight: '700', color: colors.text }}>
            {user?.email}
          </Text>
          . Daqui você publica aulas e acompanha a comunidade do portal.
        </Text>

        {/* Stats summary banner */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {postsCount !== null ? postsCount : '…'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Aulas publicadas
            </Text>
          </View>

          <View
            style={[
              styles.statBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {usersCount !== null ? usersCount : '…'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Membros cadastrados
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.sectionHeading,
            { color: colors.text, marginTop: spacing.lg },
          ]}
        >
          Ações rápidas
        </Text>

        <View style={styles.cardsGrid}>
          {SHORTCUTS.map((shortcut) => (
            <TouchableOpacity
              key={shortcut.to}
              activeOpacity={0.75}
              onPress={() => router.push(shortcut.to as any)}
              style={[
                styles.shortcutCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.primarySoft },
                ]}
              >
                <Icon name={shortcut.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.shortcutCopy}>
                <Text
                  style={[styles.shortcutLabel, { color: colors.text }]}
                >
                  {shortcut.label}
                </Text>
                <Text
                  style={[styles.shortcutDesc, { color: colors.textMuted }]}
                >
                  {shortcut.description}
                </Text>
              </View>
              <Icon
                name="chevronRight"
                size={16}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  intro: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardsGrid: {
    gap: 12,
  },
  shortcutCard: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutCopy: {
    flex: 1,
  },
  shortcutLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  shortcutDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  loadingWrap: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
