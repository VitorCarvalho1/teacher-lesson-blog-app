import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createComment } from '@/api/comments.api';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { toCommentErrorMessage } from '@/utils/comment-errors';
import {
  COMMENT_CONTENT_MAX,
  COMMENT_CONTENT_MIN,
  validateCommentContent,
} from '@/utils/validation';

type CommentFormProps = {
  postId: number;
  onCreated: () => void;
};

export default function CommentForm({ postId, onCreated }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const nextError = validateCommentContent(content);
    setError(nextError);
    setApiError(null);
    setSuccess(false);

    if (nextError) {
      return;
    }

    setLoading(true);
    try {
      await createComment(postId, { content: content.trim() });
      setContent('');
      setError(undefined);
      setSuccess(true);
      onCreated();
    } catch (caught) {
      setApiError(toCommentErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  };

  const trimmedLength = content.trim().length;

  return (
    <View style={styles.container}>
      {success ? (
        <Alert variant="success" style={{ marginBottom: 12 }}>
          Comentário publicado com sucesso.
        </Alert>
      ) : null}

      {apiError ? <Alert variant="error" style={{ marginBottom: 12 }}>{apiError}</Alert> : null}

      <TextArea
        label="Escrever um comentário"
        value={content}
        onChangeText={(val) => {
          setContent(val);
          setError(undefined);
          setApiError(null);
        }}
        placeholder="Compartilhe uma dúvida, um ajuste de aula ou um retorno da turma."
        hint={`${trimmedLength}/${COMMENT_CONTENT_MAX} · mínimo ${COMMENT_CONTENT_MIN} caracteres`}
        maxLength={COMMENT_CONTENT_MAX}
        rows={3}
        error={error}
        disabled={loading}
        required
      />

      <View style={styles.actions}>
        <Button
          variant="primary"
          loading={loading}
          disabled={loading || trimmedLength === 0}
          onPress={handleSubmit}
        >
          Publicar comentário
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  actions: {
    alignItems: 'flex-start',
  },
});
