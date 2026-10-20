import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import {
  COMMENT_CONTENT_MAX,
  COMMENT_CONTENT_MIN,
  validateCommentContent,
} from '@/utils/validation';

type CommentFormProps = {
  postId: number;
  onCreated: (content: string) => Promise<void>;
};

export default function CommentForm({ postId, onCreated }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const nextError = validateCommentContent(content);
    setError(nextError);

    if (nextError) {
      return;
    }

    setLoading(true);
    try {
      await onCreated(content.trim());
      setContent('');
      setError(undefined);
    } finally {
      setLoading(false);
    }
  };

  const trimmedLength = content.trim().length;

  return (
    <View style={styles.container}>
      <TextArea
        label="Escrever um comentário"
        value={content}
        onChangeText={(val) => {
          setContent(val);
          setError(undefined);
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
