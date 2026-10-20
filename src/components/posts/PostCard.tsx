import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Post, PostStatus } from '@/types/post';
import { excerpt, formatDate } from '@/utils/format';
import { useTheme } from '@/context/ThemeContext';

type PostCardProps = {
  post: Post;
};

const STATUS_LABEL: Record<PostStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicada',
  ARCHIVED: 'Arquivada',
  DELETED: 'Removida',
};

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { colors, radius, spacing } = useTheme();

  const author = post.author?.name ?? 'Autor não informado';
  const publishedAt = formatDate(post.created_at);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => router.push(`/posts/${post.id}` as any)}
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {post.title}
        </Text>
        {post.status !== 'PUBLISHED' ? (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: colors.surfaceMuted,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.textMuted }]}>
              {STATUS_LABEL[post.status]}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        style={[styles.excerpt, { color: colors.textMuted }]}
        numberOfLines={3}
      >
        {excerpt(post.description, 160)}
      </Text>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.metaAuthor, { color: colors.text }]}>
          {author}
        </Text>
        {publishedAt ? (
          <Text style={[styles.metaDate, { color: colors.textMuted }]}>
            {publishedAt}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaAuthor: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaDate: {
    fontSize: 12,
  },
});
