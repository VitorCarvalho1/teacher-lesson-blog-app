import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import UserCard from '@/components/users/UserCard';
import SearchField from '@/components/ui/SearchField';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const router = useRouter();
  const { users } = useData();
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return users;
    }
    const query = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [users, search]);

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const hasQuery = search.trim().length > 0;

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

      {total === 0 ? (
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
          {paginatedUsers.map((user) => (
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
  list: {
    paddingBottom: 24,
  },
});
