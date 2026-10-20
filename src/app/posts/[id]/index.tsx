import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import CommentThread from '@/components/comments/CommentThread';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { formatLongDate } from '@/utils/format';
import { PostStatus } from '@/types/post';

const STATUS_LABEL: Record<PostStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicada',
  ARCHIVED: 'Arquivada',
  DELETED: 'Removida',
};

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, isAdmin } = useAuth();
  const { getPost, deletePost } = useData();
  const { colors, radius, spacing } = useTheme();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const postId = Number(id);
  const post = getPost(postId);

  if (!post) {
    return (
      <AppLayout title="Aula">
        <EmptyState
          kicker="Aula"
          title="Esta aula não está disponível"
          description="Ela pode ter sido removida ou o endereço está incompleto. Volte à lista para escolher outra publicação."
          action={
            <Button
              variant="primary"
              onPress={() => router.push('/posts' as any)}
            >
              Ver postagens
            </Button>
          }
        />
      </AppLayout>
    );
  }

  const author = post.author?.name ?? 'Autor não informado';
  const publishedAt = formatLongDate(post.created_at);
  const canEdit = Boolean(isAdmin && user && (user.id === post.user_id || isAdmin));

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deletePost(post.id);
      router.replace('/posts');
    } catch {
      setDeleteError('Não foi possível remover a aula.');
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout title="Aula">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push('/posts' as any)}
        style={styles.backBtn}
      >
        <Icon name="chevronLeft" size={16} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>
          Voltar às postagens
        </Text>
      </TouchableOpacity>

      {deleteError ? <Alert variant="error">{deleteError}</Alert> : null}

      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.accent }]}>Aula</Text>
        <View style={styles.headingRow}>
          <Text style={[styles.title, { color: colors.text }]}>
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

        <View style={styles.metaRow}>
          <Text style={[styles.metaAuthor, { color: colors.text }]}>
            {author}
          </Text>
          {publishedAt ? (
            <>
              <Text style={{ color: colors.textMuted }}>·</Text>
              <Text style={[styles.metaDate, { color: colors.textMuted }]}>
                {publishedAt}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.bodyCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.base,
          },
        ]}
      >
        <Text style={[styles.bodyText, { color: colors.text }]}>
          {post.description}
        </Text>
      </View>

      {/* Admin management section */}
      {isAdmin ? (
        <View
          style={[
            styles.manageSection,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
              padding: spacing.base,
            },
          ]}
        >
          {canEdit ? (
            <Button
              variant="primary"
              onPress={() => router.push(`/posts/${post.id}/edit` as any)}
              style={{ marginBottom: 14 }}
            >
              Editar aula
            </Button>
          ) : (
            <Text style={[styles.hint, { color: colors.textMuted, marginBottom: 12 }]}>
              Somente quem publicou pode editar o conteúdo. Você ainda pode remover a aula.
            </Text>
          )}

          <View style={[styles.dangerBox, { borderTopColor: colors.border }]}>
            <Text style={[styles.dangerTitle, { color: colors.danger }]}>
              Remover aula
            </Text>
            <Text style={[styles.dangerCopy, { color: colors.textMuted }]}>
              A publicação some da lista da comunidade. Esta ação não restaura o
              texto automaticamente.
            </Text>

            {confirmingDelete ? (
              <View style={styles.confirmBox}>
                <Text style={[styles.confirmPrompt, { color: colors.text }]}>
                  Remover <Text style={{ fontWeight: '700' }}>{post.title}</Text>?
                </Text>
                <View style={styles.confirmActions}>
                  <Button
                    variant="danger"
                    loading={isDeleting}
                    onPress={handleDelete}
                  >
                    Sim, remover
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={isDeleting}
                    onPress={() => setConfirmingDelete(false)}
                  >
                    Cancelar
                  </Button>
                </View>
              </View>
            ) : (
              <Button
                variant="danger"
                onPress={() => setConfirmingDelete(true)}
              >
                Remover aula
              </Button>
            )}
          </View>
        </View>
      ) : null}

      <CommentThread postId={post.id} />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    marginBottom: 16,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 30,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metaAuthor: {
    fontSize: 13,
    fontWeight: '600',
  },
  metaDate: {
    fontSize: 13,
  },
  bodyCard: {
    borderWidth: 1,
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
  },
  manageSection: {
    borderWidth: 1,
    marginBottom: 20,
  },
  hint: {
    fontSize: 13,
  },
  dangerBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dangerCopy: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  confirmBox: {
    gap: 10,
  },
  confirmPrompt: {
    fontSize: 14,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
  },
});
