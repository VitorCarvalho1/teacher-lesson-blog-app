import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Comment } from '@/types/comment';
import { User } from '@/types/auth';
import Avatar from '@/components/ui/Avatar';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { formatDateTime } from '@/utils/format';
import { getRoleLabel } from '@/utils/user-display';
import { validateCommentContent, COMMENT_CONTENT_MAX } from '@/utils/validation';
import { useTheme } from '@/context/ThemeContext';

type CommentItemProps = {
  comment: Comment;
  currentUser: User | null;
  onUpdate: (id: number, content: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function CommentItem({
  comment,
  currentUser,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const { colors, radius, spacing } = useTheme();

  const authorName = comment.author?.name ?? 'Pessoa da comunidade';
  const authorRole = comment.author?.role ?? 'USER';
  const isAuthor = Boolean(currentUser && currentUser.id === comment.user_id);
  const canDelete = Boolean(isAuthor || currentUser?.role === 'ADMIN');
  const postedAt = formatDateTime(comment.created_at);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [error, setError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSave = async () => {
    const nextError = validateCommentContent(draft);
    setError(nextError);
    if (nextError) {
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(comment.id, draft.trim());
      setEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  };

  const isAdmin = authorRole === 'ADMIN';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Avatar name={authorName} role={authorRole} size="sm" />
        <View style={styles.authorMeta}>
          <View style={styles.nameRow}>
            <Text style={[styles.authorName, { color: colors.text }]}>
              {authorName}
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
                {getRoleLabel(authorRole)}
              </Text>
            </View>
          </View>
          {postedAt ? (
            <Text style={[styles.time, { color: colors.textMuted }]}>
              {postedAt}
            </Text>
          ) : null}
        </View>
      </View>

      {editing ? (
        <View style={styles.editWrap}>
          <TextArea
            label="Editar comentário"
            value={draft}
            onChangeText={(val) => {
              setDraft(val);
              setError(undefined);
            }}
            maxLength={COMMENT_CONTENT_MAX}
            rows={3}
            error={error}
            disabled={isSaving}
          />
          <View style={styles.actionsRow}>
            <Button
              variant="primary"
              loading={isSaving}
              disabled={isDeleting}
              onPress={handleSave}
            >
              Salvar
            </Button>
            <TouchableOpacity
              onPress={() => {
                setEditing(false);
                setDraft(comment.content);
                setError(undefined);
              }}
              style={styles.cancelBtn}
            >
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={[styles.content, { color: colors.text }]}>
          {comment.content}
        </Text>
      )}

      {!editing && (isAuthor || canDelete) ? (
        <View style={styles.actionsRow}>
          {isAuthor ? (
            <TouchableOpacity
              onPress={() => {
                setEditing(true);
                setConfirmingDelete(false);
              }}
              style={styles.actionBtn}
            >
              <Text style={[styles.actionText, { color: colors.primary }]}>
                Editar
              </Text>
            </TouchableOpacity>
          ) : null}

          {canDelete ? (
            confirmingDelete ? (
              <View style={styles.confirmRow}>
                <Button
                  variant="danger"
                  loading={isDeleting}
                  onPress={handleDelete}
                  style={{ height: 32 }}
                >
                  Sim, remover
                </Button>
                <TouchableOpacity
                  onPress={() => setConfirmingDelete(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={[styles.cancelText, { color: colors.textMuted }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setConfirmingDelete(true)}
                style={styles.actionBtn}
              >
                <Text style={[styles.actionText, { color: colors.danger }]}>
                  Remover
                </Text>
              </TouchableOpacity>
            )
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  authorMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  roleBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  time: {
    fontSize: 11,
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 4,
  },
  editWrap: {
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cancelText: {
    fontSize: 13,
  },
});
