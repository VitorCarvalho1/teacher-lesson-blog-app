import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AuthLayout from '@/components/auth/AuthLayout';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { validateEmail, validatePassword } from '@/utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('henrique.viana@escola.edu.br');
  const [password, setPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const errs = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(errs);
    setApiError(null);

    if (errs.email || errs.password) {
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, rememberMe });
      router.replace('/posts');
    } catch {
      setApiError('Não foi possível entrar. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Use o e-mail da comunidade acadêmica para acessar as publicações."
    >
      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

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
        placeholder="Digite sua senha"
        disabled={loading}
        required
      />

      <Checkbox
        label="Manter-me conectado neste dispositivo"
        checked={rememberMe}
        onChange={setRememberMe}
        disabled={loading}
      />

      <View style={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.textMuted }]}>
            Ainda não tem conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/register' as any)}>
            <Text style={[styles.switchLink, { color: colors.primary }]}>
              Criar cadastro
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
