import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CommentForm from '@/components/comments/CommentForm';
import CommentItem from '@/components/comments/CommentItem';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';

const PAGE_SIZE = 5;

type CommentThreadProps = {
  postId: number;
};

export default function CommentThread({ postId }: CommentThreadProps) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { getCommentsForPost, createComment, updateComment, deleteComment } =
    useData();
  const [page, setPage] = useState(1);

  const comments = getCommentsForPost(postId);
  const total = comments.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const pagedComments = comments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreated = async (content: string) => {
    await createComment(postId, { content });
    setPage(1);
  };

  const handleUpdate = async (id: number, content: string) => {
    await updateComment(postId, id, { content });
  };

  const handleDelete = async (id: number) => {
    await deleteComment(postId, id);
    if (pagedComments.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

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

      {total === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          Ainda não há comentários nesta aula. Seja a primeira pessoa a escrever.
        </Text>
      ) : (
        <View style={styles.list}>
          {pagedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
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
  list: {
    marginTop: 12,
  },
});
