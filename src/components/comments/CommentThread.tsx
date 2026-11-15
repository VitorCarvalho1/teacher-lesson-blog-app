import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import CommentForm from '@/components/comments/CommentForm';
import CommentItem from '@/components/comments/CommentItem';
import Pagination from '@/components/ui/Pagination';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useComments } from '@/hooks/useComments';

const PAGE_SIZE = 10;

type CommentThreadProps = {
  postId: number;
};

export default function CommentThread({ postId }: CommentThreadProps) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [page, setPage] = useState(1);
  const { comments, meta, isLoading, error, reload } = useComments(
    postId,
    page,
    PAGE_SIZE
  );

  const handleCreated = () => {
    if (page !== 1) {
      setPage(1);
      return;
    }
    reload();
  };

  const handleChanged = () => {
    if (comments.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
      return;
    }
    reload();
  };

  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Comentários</Text>
        <Text style={[styles.lead, { color: colors.textMuted }]}>
          A conversa fica nesta aula. Qualquer pessoa da comunidade pode
          participar.
          {total > 0
            ? ` ${total} ${total === 1 ? 'comentário' : 'comentários'}.`
            : ''}
        </Text>
      </View>

      <CommentForm postId={postId} onCreated={handleCreated} />

      {error ? (
        <Alert variant="error" style={{ marginVertical: 8 }}>
          {error}
        </Alert>
      ) : null}

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : total === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          Ainda não há comentários nesta aula. Seja a primeira pessoa a escrever.
        </Text>
      ) : (
        <View style={styles.list}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onChanged={handleChanged}
            />
          ))}

          {totalPages > 1 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={PAGE_SIZE}
              onPageChange={setPage}
            />
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  lead: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  empty: {
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 16,
    textAlign: 'center',
  },
  loadingWrap: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  list: {
    marginTop: 12,
  },
});
