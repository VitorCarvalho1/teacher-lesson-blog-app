import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Icon from '@/components/ui/Icon';
import { UserRole } from '@/types/auth';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import {
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation';

export default function NewUserPage() {
  const router = useRouter();
  const { createUser } = useData();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const errs = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirm(password, confirmPassword),
    };
    setErrors(errs);
    setApiError(null);

    if (errs.name || errs.email || errs.password || errs.confirmPassword) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createUser({
        name: name.trim(),
        email: normalizeEmail(email),
        password,
        role,
      });
      router.replace(`/users/${created.id}` as any);
    } catch {
      setApiError('Não foi possível cadastrar a pessoa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    {
      label: 'Membro',
      value: 'USER',
      hint: 'Membros leem e comentam nas aulas publicadas.',
    },
    {
      label: 'Administrador',
      value: 'ADMIN',
      hint: 'Administradores publicam aulas e gerenciam a comunidade.',
    },
  ];

  return (
    <AppLayout title="Nova pessoa">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push('/users' as any)}
        style={styles.backBtn}
      >
        <Icon name="chevronLeft" size={16} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>
          Voltar à comunidade
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.accent }]}>
          Comunidade
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>Nova pessoa</Text>
        <Text style={[styles.lead, { color: colors.textMuted }]}>
          Cadastre um docente ou estudante. A pessoa já consegue entrar no
          portal com o e-mail e a senha definidos aqui.
        </Text>
      </View>

      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <View style={styles.form}>
        <TextField
          label="Nome completo"
          value={name}
          onChangeText={(val) => {
            setName(val);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="Nome da pessoa"
          error={errors.name}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="E-mail"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="email@escola.edu.br"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          disabled={isSubmitting}
          required
        />

        <SelectField
          label="Perfil"
          value={role}
          onValueChange={(val) => setRole(val as UserRole)}
          options={roleOptions}
          hint="Membros leem as aulas. Administradores publicam e gerem a comunidade."
          disabled={isSubmitting}
        />

        <PasswordField
          label="Senha"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="Defina uma senha"
          hint={`Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
          error={errors.password}
          disabled={isSubmitting}
          required
        />

        <PasswordField
          label="Confirmar senha"
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          placeholder="Repita a senha"
          error={errors.confirmPassword}
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
            {isSubmitting ? 'Cadastrando…' : 'Cadastrar pessoa'}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            disabled={isSubmitting}
            onPress={() => router.push('/users' as any)}
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
