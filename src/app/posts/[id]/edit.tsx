import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import {
  POST_DESCRIPTION_MAX,
  POST_DESCRIPTION_MIN,
  POST_TITLE_MAX,
  validatePostDescription,
  validatePostTitle,
} from '@/utils/validation';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getPost, updatePost } = useData();
  const { colors } = useTheme();

  const postId = Number(id);
  const post = getPost(postId);

  const [sourceId, setSourceId] = useState<number | null>(null);
  const [title, setTitle] = useState(post?.title ?? '');
  const [description, setDescription] = useState(post?.description ?? '');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (post && post.id !== sourceId) {
    setSourceId(post.id);
    setTitle(post.title);
    setDescription(post.description);
    setErrors({});
    setApiError(null);
  }

  if (!post) {
    return (
      <AppLayout title="Editar aula">
        <EmptyState
          kicker="Aula"
          title="Esta aula não está disponível"
          description="Ela pode ter sido removida ou o endereço está incompleto."
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

  const handleSubmit = async () => {
    const errs = {
      title: validatePostTitle(title),
      description: validatePostDescription(description),
    };
    setErrors(errs);
    setApiError(null);

    if (errs.title || errs.description) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePost(post.id, {
        title: title.trim(),
        description: description.trim(),
      });
      router.replace(`/posts/${post.id}` as any);
    } catch {
      setApiError('Não foi possível salvar as alterações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleLength = title.trim().length;
  const descLength = description.trim().length;

  return (
    <AppLayout title="Editar aula">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/posts/${post.id}` as any)}
        style={styles.backBtn}
      >
        <Icon name="chevronLeft" size={16} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>
          Voltar à aula
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.accent }]}>Editar</Text>
        <Text style={[styles.title, { color: colors.text }]}>Atualizar aula</Text>
        <Text style={[styles.lead, { color: colors.textMuted }]}>
          Ajuste o título ou o conteúdo. A versão nova substitui a anterior na
          lista da comunidade.
        </Text>
      </View>

      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <View style={styles.form}>
        <TextField
          label="Título"
          value={title}
          onChangeText={(val) => {
            setTitle(val);
            setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          hint={`${titleLength}/${POST_TITLE_MAX}`}
          maxLength={POST_TITLE_MAX}
          error={errors.title}
          disabled={isSubmitting}
          required
        />

        <TextArea
          label="Conteúdo da aula"
          value={description}
          onChangeText={(val) => {
            setDescription(val);
            setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          hint={`${descLength}/${POST_DESCRIPTION_MAX} · mínimo ${POST_DESCRIPTION_MIN} caracteres`}
          maxLength={POST_DESCRIPTION_MAX}
          rows={8}
          error={errors.description}
          disabled={isSubmitting}
          required
        />

        <View style={styles.actions}>
          <Button
            variant="primary"
            fullWidth
            loading={isSubmitting}
            onPress={handleSubmit}
          >
            {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            disabled={isSubmitting}
            onPress={() => router.push(`/posts/${post.id}` as any)}
          >
            Cancelar
          </Button>
        </View>
      </View>
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
    marginBottom: 20,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  lead: {
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 12,
  },
  actions: {
    marginTop: 8,
    gap: 10,
  },
});
