import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
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

export default function NewPostPage() {
  const router = useRouter();
  const { createPost } = useData();
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const created = await createPost({
        title: title.trim(),
        description: description.trim(),
      });
      router.replace(`/posts/${created.id}` as any);
    } catch {
      setApiError('Não foi possível publicar a aula. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleLength = title.trim().length;
  const descLength = description.trim().length;

  return (
    <AppLayout title="Nova aula">
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

      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.accent }]}>Escrever</Text>
        <Text style={[styles.title, { color: colors.text }]}>Nova aula</Text>
        <Text style={[styles.lead, { color: colors.textMuted }]}>
          Compartilhe uma proposta de atividade, roteiro de estudos ou reflexão
          pedagógica com a comunidade.
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
          placeholder="Ex.: Rotina de leitura no início da aula"
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
          placeholder="Descreva o objetivo, os passos e o que a turma deve observar."
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
            {isSubmitting ? 'Publicando…' : 'Publicar aula'}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            disabled={isSubmitting}
            onPress={() => router.push('/posts' as any)}
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
