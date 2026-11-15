import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import UserCard from '@/components/users/UserCard';
import SearchField from '@/components/ui/SearchField';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useUsers } from '@/hooks/useUsers';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const router = useRouter();
  const { deletedName } = useLocalSearchParams<{ deletedName?: string }>();
  const { colors } = useTheme();
  const { isAdmin, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/posts');
    }
  }, [authLoading, isAdmin, router]);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const { users, meta, isLoading, error } = useUsers(
    debouncedSearch.trim(),
    page,
    PAGE_SIZE
  );

  const total = meta?.total ?? users.length;
  const totalPages = meta?.totalPages ?? 1;
  const hasQuery = search.trim().length > 0;

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <AppLayout title="Comunidade">
      <View style={styles.toolbar}>
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <SearchField
              label="Buscar na comunidade"
              value={search}
              placeholder="Nome ou e-mail"
              onChangeText={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </View>
          <View style={styles.actionWrap}>
            <Text style={styles.hiddenLabel}>&nbsp;</Text>
            <Button
              variant="primary"
              onPress={() => router.push('/users/new' as any)}
              style={styles.addBtn}
            >
              Nova pessoa
            </Button>
          </View>
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          A busca olha nome e e-mail. A lista atualiza sozinha.
        </Text>
      </View>

      {deletedName ? (
        <Alert variant="success" style={{ marginBottom: 16 }}>
          {`${deletedName} foi removido(a) da comunidade.`}
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="error" style={{ marginBottom: 16 }}>
          {error}
        </Alert>
      ) : null}

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : total === 0 ? (
        <EmptyState
          kicker="Comunidade"
          title={
            hasQuery ? 'Nenhuma pessoa encontrada' : 'Ainda não há pessoas cadastradas'
          }
          description={
            hasQuery
              ? `Não encontramos resultados para “${search}”. Tente outro nome ou e-mail.`
              : 'Quando alguém for cadastrado, o perfil aparece aqui para a gestão da comunidade.'
          }
          action={
            !hasQuery ? (
              <Button
                variant="primary"
                onPress={() => router.push('/users/new' as any)}
              >
                Cadastrar a primeira pessoa
              </Button>
            ) : null
          }
        />
      ) : (
        <View style={styles.list}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
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
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  searchWrap: {
    flex: 1,
  },
  actionWrap: {},
  hiddenLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  addBtn: {
    height: 44,
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingBottom: 24,
  },
});
