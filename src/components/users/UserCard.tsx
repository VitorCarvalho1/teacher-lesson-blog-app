import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from '@/types/auth';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/utils/format';
import { getRoleLabel } from '@/utils/user-display';
import { useTheme } from '@/context/ThemeContext';

type UserCardProps = {
  user: User;
};

export default function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const { colors, radius, spacing } = useTheme();

  const joinedAt = formatDate(user.created_at);
  const isAdmin = user.role === 'ADMIN';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => router.push(`/users/${user.id}` as any)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.base,
        },
      ]}
    >
      <Avatar name={user.name} role={user.role} size="md" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {user.name}
          </Text>
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor: isAdmin ? colors.accentSoft : colors.primarySoft,
                borderColor: isAdmin ? colors.accent : colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.roleText,
                { color: isAdmin ? colors.accent : colors.primary },
              ]}
            >
              {getRoleLabel(user.role)}
            </Text>
          </View>
        </View>

        <Text style={[styles.email, { color: colors.textMuted }]} numberOfLines={1}>
          {user.email}
        </Text>

        {joinedAt ? (
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            Na comunidade desde {joinedAt}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  roleBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 13,
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
  },
});
