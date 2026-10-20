import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AuthLayout from '@/components/auth/AuthLayout';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await register({ name, email, password });
      router.replace('/posts');
    } catch {
      setApiError('Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Criar cadastro"
      subtitle="O registro público cria uma conta de estudante. Docentes administradores são provisionados à parte."
    >
      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <TextField
        label="Nome completo"
        value={name}
        onChangeText={(val) => {
          setName(val);
          setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={errors.name}
        placeholder="Seu nome completo"
        disabled={loading}
        required
      />

      <TextField
        label="E-mail"
        value={email}
        onChangeText={(val) => {
          setEmail(val);
          setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
        placeholder="seu.email@escola.edu.br"
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
        required
      />

      <PasswordField
        label="Senha"
        value={password}
        onChangeText={(val) => {
          setPassword(val);
          setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={errors.password}
        hint={`Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
        placeholder="Defina uma senha"
        disabled={loading}
        required
      />

      <PasswordField
        label="Confirmar senha"
        value={confirmPassword}
        onChangeText={(val) => {
          setConfirmPassword(val);
          setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        error={errors.confirmPassword}
        placeholder="Repita a senha"
        disabled={loading}
        required
      />

      <View style={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
        >
          {loading ? 'Criando conta…' : 'Criar conta'}
        </Button>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.textMuted }]}>
            Já tem cadastro?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/login' as any)}>
            <Text style={[styles.switchLink, { color: colors.primary }]}>
              Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: 18,
    gap: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  switchText: {
    fontSize: 14,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
