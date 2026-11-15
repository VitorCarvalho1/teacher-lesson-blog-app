import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteUser, updateUser } from '@/api/users.api';
import AppLayout from '@/components/layout/AppLayout';
import Avatar from '@/components/ui/Avatar';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import { UserRole, UpdateUserPayload } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { formatDate } from '@/utils/format';
import { getRoleLabel } from '@/utils/user-display';
import { toUserErrorMessage } from '@/utils/user-errors';
import {
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  validateCurrentPassword,
  validateEmail,
  validateName,
  validateOptionalPassword,
  validatePasswordConfirm,
} from '@/utils/validation';

export default function UserDetailPage() {
  const router = useRouter();
  const { id, created } = useLocalSearchParams<{ id?: string; created?: string }>();
  const { user: currentUser, updateSessionUser, isAdmin, isLoading: authLoading } = useAuth();
  const { colors, radius, spacing } = useTheme();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/posts');
    }
  }, [authLoading, isAdmin, router]);

  const userId = Number(id);
  const { user: targetUser, isLoading, error, notFound } = useUser(
    userId > 0 ? userId : null
  );

  const [sourceId, setSourceId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    currentPassword?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(created === '1' ? 'created' : null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (targetUser && targetUser.id !== sourceId) {
    setSourceId(targetUser.id);
    setName(targetUser.name);
    setEmail(targetUser.email);
    setRole(targetUser.role);
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setErrors({});
    setApiError(null);
    setConfirmingDelete(false);
  }

  if (authLoading || !isAdmin) {
    return null;
  }

  if (notFound && !isLoading) {
    return (
      <AppLayout title="Pessoa">
        <EmptyState
          kicker="Comunidade"
          title="Esta pessoa não está disponível"
          description="O perfil pode ter sido removido ou o endereço está incorreto."
          action={
            <Button
              variant="primary"
              onPress={() => router.push('/users' as any)}
            >
              Ver comunidade
            </Button>
          }
        />
      </AppLayout>
    );
  }

  if (error && !isLoading) {
    return (
      <AppLayout title="Pessoa">
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
        <Alert variant="error">{error}</Alert>
      </AppLayout>
    );
  }

  if (isLoading || !targetUser) {
    return (
      <AppLayout title="Pessoa">
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AppLayout>
    );
  }

  const isSelf = currentUser?.id === targetUser.id;
  const joinedAt = formatDate(targetUser.created_at);
  const isTargetAdmin = targetUser.role === 'ADMIN';

  const roleOptions = [
    { label: 'Membro', value: 'USER' },
    { label: 'Administrador', value: 'ADMIN' },
  ];

  const handleSave = async () => {
    const errs = {
      name: validateName(name),
      email: validateEmail(email),
      currentPassword:
        isSelf && password ? validateCurrentPassword(currentPassword) : undefined,
      password: validateOptionalPassword(password),
      confirmPassword: password
        ? validatePasswordConfirm(password, confirmPassword)
        : undefined,
    };
    setErrors(errs);
    setApiError(null);
    setSuccess(null);

    if (
      errs.name ||
      errs.email ||
      errs.currentPassword ||
      errs.password ||
      errs.confirmPassword
    ) {
      return;
    }

    const payload: UpdateUserPayload = {
      name: name.trim(),
      email: normalizeEmail(email),
    };

    if (!isSelf) {
      payload.role = role;
    }

    if (password) {
      payload.password = password;
      if (isSelf) {
        payload.currentPassword = currentPassword;
      }
    }

    setIsSaving(true);
    try {
      const response = await updateUser(targetUser.id, payload);
      const updatedUser = response.data;

      setSourceId(updatedUser.id);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setRole(updatedUser.role);
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setSuccess('updated');

      if (isSelf) {
        updateSessionUser(updatedUser);
      }
    } catch (caught) {
      setApiError(toUserErrorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isSelf) return;

    setIsDeleting(true);
    setApiError(null);
    try {
      await deleteUser(targetUser.id);
      router.replace({
        pathname: '/users',
        params: { deletedName: targetUser.name },
      } as any);
    } catch (caught) {
      setApiError(toUserErrorMessage(caught));
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout title="Pessoa">
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

      {/* Profile summary header */}
      <View
        style={[
          styles.profileHeader,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.base,
          },
        ]}
      >
        <Avatar name={name} role={role} size="lg" />
        <View style={styles.profileMeta}>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {name}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
            {email}
          </Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: isTargetAdmin ? colors.accentSoft : colors.primarySoft,
                  borderColor: isTargetAdmin ? colors.accent : colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  { color: isTargetAdmin ? colors.accent : colors.primary },
                ]}
              >
                {getRoleLabel(role)}
              </Text>
            </View>
            {joinedAt ? (
              <Text style={[styles.joinedText, { color: colors.textMuted }]}>
                Desde {joinedAt}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {success === 'created' ? (
        <Alert variant="success" style={{ marginBottom: 12 }}>
          Pessoa cadastrada. O perfil já aparece na comunidade.
        </Alert>
      ) : null}

      {success === 'updated' ? (
        <Alert variant="success" style={{ marginBottom: 12 }}>
          Dados atualizados com sucesso.
        </Alert>
      ) : null}

      {apiError ? (
        <Alert variant="error" style={{ marginBottom: 12 }}>
          {apiError}
        </Alert>
      ) : null}

      {/* Edit form */}
      <View
        style={[
          styles.formCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.base,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Dados cadastrais
        </Text>

        <TextField
          label="Nome completo"
          value={name}
          onChangeText={(val) => {
            setName(val);
            setErrors((prev) => ({ ...prev, name: undefined }));
            setSuccess(null);
          }}
          error={errors.name}
          disabled={isSaving || isDeleting}
          required
        />

        <TextField
          label="E-mail"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            setErrors((prev) => ({ ...prev, email: undefined }));
            setSuccess(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          disabled={isSaving || isDeleting}
          required
        />

        <SelectField
          label="Perfil"
          value={role}
          onValueChange={(val) => {
            setRole(val as UserRole);
            setSuccess(null);
          }}
          options={roleOptions}
          disabled={isSelf || isSaving || isDeleting}
          hint={isSelf ? 'Você não pode alterar o próprio perfil por aqui.' : undefined}
        />

        <Text
          style={[
            styles.subTitle,
            { color: colors.text, marginTop: spacing.md },
          ]}
        >
          Redefinir senha (opcional)
        </Text>

        <PasswordField
          label="Nova senha"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setErrors((prev) => ({ ...prev, password: undefined }));
            setSuccess(null);
          }}
          placeholder="Deixe em branco para não alterar"
          hint={`Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres se for alterar.`}
          error={errors.password}
          disabled={isSaving || isDeleting}
        />

        {isSelf && password ? (
          <PasswordField
            label="Senha atual"
            value={currentPassword}
            onChangeText={(val) => {
              setCurrentPassword(val);
              setErrors((prev) => ({ ...prev, currentPassword: undefined }));
              setSuccess(null);
            }}
            placeholder="Digite a senha atual"
            error={errors.currentPassword}
            disabled={isSaving || isDeleting}
            required
          />
        ) : null}

        {password ? (
          <PasswordField
            label="Confirmar nova senha"
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              setSuccess(null);
            }}
            placeholder="Confirme a nova senha"
            error={errors.confirmPassword}
            disabled={isSaving || isDeleting}
            required
          />
        ) : null}

        <Button
          variant="primary"
          fullWidth
          loading={isSaving}
          disabled={isDeleting}
          onPress={handleSave}
          style={{ marginTop: 12 }}
        >
          Salvar alterações
        </Button>
      </View>

      {/* Danger Zone */}
      <View
        style={[
          styles.dangerSection,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.base,
          },
        ]}
      >
        <Text style={[styles.dangerTitle, { color: colors.danger }]}>
          Remover da comunidade
        </Text>
        {isSelf ? (
          <Text style={[styles.dangerHint, { color: colors.textMuted }]}>
            Você não pode remover a própria conta. Peça a outro administrador se
            precisar encerrar este acesso.
          </Text>
        ) : (
          <>
            <Text style={[styles.dangerHint, { color: colors.textMuted }]}>
              A pessoa deixa de entrar no portal. As aulas que ela publicou
              continuam visíveis.
            </Text>

            {confirmingDelete ? (
              <View style={styles.confirmBox}>
                <Text style={[styles.confirmPrompt, { color: colors.text }]}>
                  Remover <Text style={{ fontWeight: '700' }}>{name}</Text>?
                  Esta ação não restaura o acesso automaticamente.
                </Text>
                <View style={styles.confirmActions}>
                  <Button
                    variant="danger"
                    loading={isDeleting}
                    onPress={handleDelete}
                  >
                    Sim, remover
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={isDeleting}
                    onPress={() => setConfirmingDelete(false)}
                  >
                    Cancelar
                  </Button>
                </View>
              </View>
            ) : (
              <Button
                variant="danger"
                disabled={isSaving}
                onPress={() => setConfirmingDelete(true)}
              >
                Remover da comunidade
              </Button>
            )}
          </>
        )}
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
  profileHeader: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  roleBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  joinedText: {
    fontSize: 11,
  },
  formCard: {
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  dangerSection: {
    borderWidth: 1,
    marginBottom: 24,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dangerHint: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  confirmBox: {
    gap: 10,
  },
  confirmPrompt: {
    fontSize: 14,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
