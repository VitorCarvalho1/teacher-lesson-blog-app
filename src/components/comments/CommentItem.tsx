import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { deleteComment, updateComment } from '@/api/comments.api';
import Avatar from '@/components/ui/Avatar';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/types/auth';
import { Comment } from '@/types/comment';
import { toCommentErrorMessage } from '@/utils/comment-errors';
import { formatDateTime } from '@/utils/format';
import { getRoleLabel } from '@/utils/user-display';
import {
  COMMENT_CONTENT_MAX,
  COMMENT_CONTENT_MIN,
  validateCommentContent,
} from '@/utils/validation';

type CommentItemProps = {
  comment: Comment;
  currentUser: User | null;
  onChanged: () => void;
};

function wasEdited(comment: Comment): boolean {
  const created = new Date(comment.created_at).getTime();
  const updated = new Date(comment.updated_at).getTime();
  return Number.isFinite(created) && Number.isFinite(updated) && updated - created > 2000;
}

export default function CommentItem({
  comment,
  currentUser,
  onChanged,
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSave = async () => {
    const nextError = validateCommentContent(draft);
    setError(nextError);
    setApiError(null);
    setSuccessMsg(null);
    if (nextError) {
      return;
    }

    setIsSaving(true);
    try {
      await updateComment(comment.post_id, comment.id, { content: draft.trim() });
      setEditing(false);
      setSuccessMsg('Comentário atualizado.');
      onChanged();
    } catch (caught) {
      setApiError(toCommentErrorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setApiError(null);
    setSuccessMsg(null);
    try {
      await deleteComment(comment.post_id, comment.id);
      onChanged();
    } catch (caught) {
      setApiError(toCommentErrorMessage(caught));
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
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
            {wasEdited(comment) ? (
              <Text style={[styles.editedText, { color: colors.textMuted }]}>
                editado
              </Text>
            ) : null}
          </View>
          {postedAt ? (
            <Text style={[styles.time, { color: colors.textMuted }]}>
              {postedAt}
            </Text>
          ) : null}
        </View>
      </View>

      {apiError ? (
        <Alert variant="error" style={{ marginVertical: 6 }}>
          {apiError}
        </Alert>
      ) : null}

      {successMsg ? (
        <Alert variant="success" style={{ marginVertical: 6 }}>
          {successMsg}
        </Alert>
      ) : null}

      {editing ? (
        <View style={styles.editWrap}>
          <TextArea
            label="Editar comentário"
            value={draft}
            onChangeText={(val) => {
              setDraft(val);
              setError(undefined);
            }}
            hint={`${draft.trim().length}/${COMMENT_CONTENT_MAX} · mínimo ${COMMENT_CONTENT_MIN} caracteres`}
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
                setApiError(null);
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
                setApiError(null);
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
                  size="sm"
                  loading={isDeleting}
                  onPress={handleDelete}
                >
                  {isDeleting ? 'Removendo…' : 'Sim, remover'}
                </Button>
                <TouchableOpacity
                  onPress={() => setConfirmingDelete(false)}
                  disabled={isDeleting}
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
    flexWrap: 'wrap',
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
  editedText: {
    fontSize: 11,
    fontStyle: 'italic',
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
