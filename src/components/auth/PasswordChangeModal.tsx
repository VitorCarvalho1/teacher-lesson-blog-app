import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { updateMe } from '@/api/users.api';
import Modal from '@/components/ui/Modal';
import PasswordField from '@/components/ui/PasswordField';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { toUserErrorMessage } from '@/utils/user-errors';
import {
  MIN_PASSWORD_LENGTH,
  validateCurrentPassword,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation';

type PasswordChangeModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function PasswordChangeModal({
  visible,
  onClose,
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const errs = {
      currentPassword: validateCurrentPassword(currentPassword),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirm(password, confirmPassword),
    };
    setErrors(errs);
    setApiError(null);
    setSuccess(false);

    if (errs.currentPassword || errs.password || errs.confirmPassword) {
      return;
    }

    setLoading(true);
    try {
      await updateMe({
        password,
        currentPassword,
      });
      setSuccess(true);
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setApiError(toUserErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setApiError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      title="Alterar senha"
      description="Use a senha atual para definir uma nova. Depois, entre com ela nas próximas sessões."
      visible={visible}
      onClose={handleClose}
    >
      <View style={styles.content}>
        {success ? (
          <Alert variant="success">Senha atualizada com sucesso.</Alert>
        ) : null}
        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <PasswordField
          label="Senha atual"
          value={currentPassword}
          onChangeText={(val) => {
            setCurrentPassword(val);
            setErrors((prev) => ({ ...prev, currentPassword: undefined }));
            setSuccess(false);
          }}
          error={errors.currentPassword}
          placeholder="Digite a senha atual"
          disabled={loading}
          required
        />

        <PasswordField
          label="Nova senha"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setErrors((prev) => ({ ...prev, password: undefined }));
            setSuccess(false);
          }}
          error={errors.password}
          hint={`Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
          placeholder="Digite a nova senha"
          disabled={loading}
          required
        />

        <PasswordField
          label="Confirmar nova senha"
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            setSuccess(false);
          }}
          error={errors.confirmPassword}
          placeholder="Confirme a nova senha"
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
            {loading ? 'Salvando…' : 'Salvar senha'}
          </Button>
          <Button
            variant="ghost"
            fullWidth
            disabled={loading}
            onPress={handleClose}
            style={{ marginTop: 8 }}
          >
            Fechar
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
  actions: {
    marginTop: 12,
  },
});
