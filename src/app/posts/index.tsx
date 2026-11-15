import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import PostCard from '@/components/posts/PostCard';
import SearchField from '@/components/ui/SearchField';
import DateRangePicker, { DateRange } from '@/components/ui/DateRangePicker';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePosts } from '@/hooks/usePosts';

const PAGE_SIZE = 10;

function emptyDescription(search: string, hasDates: boolean): string {
  if (search && hasDates) {
    return `Não encontramos aulas para “${search}” neste período. Tente outra palavra-chave ou outro intervalo.`;
  }
  if (search) {
    return `Não encontramos resultados para “${search}”. Tente outra palavra-chave.`;
  }
  if (hasDates) {
    return 'Não encontramos aulas neste período. Experimente outro intervalo no calendário.';
  }
  return 'Quando as aulas forem publicadas, elas aparecem nesta lista para toda a comunidade autenticada.';
}

export default function PostsPage() {
  const router = useRouter();
  const { deletedTitle } = useLocalSearchParams<{ deletedTitle?: string }>();
  const { isAdmin } = useAuth();
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const { posts, meta, isLoading, error } = usePosts(
    debouncedSearch.trim(),
    page,
    PAGE_SIZE,
    dateRange.from,
    dateRange.to
  );

  const total = meta?.total ?? posts.length;
  const totalPages = meta?.totalPages ?? 1;

  const hasDates = Boolean(dateRange.from || dateRange.to);
  const hasQuery = search.trim().length > 0 || hasDates;

  return (
    <AppLayout title="Postagens">
      <View style={styles.toolbar}>
        <SearchField
          label="Buscar por palavra-chave"
          value={search}
          placeholder="Título ou conteúdo da aula"
          onChangeText={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        <View style={styles.filterRow}>
          <View style={styles.datePickerWrap}>
            <DateRangePicker
              label="Período"
              from={dateRange.from}
              to={dateRange.to}
              onChange={(range) => {
                setDateRange(range);
                setPage(1);
              }}
            />
          </View>

          {isAdmin ? (
            <View style={styles.actionWrap}>
              <Text style={styles.hiddenLabel}>&nbsp;</Text>
              <Button
                variant="primary"
                onPress={() => router.push('/posts/new' as any)}
                style={styles.composeBtn}
              >
                Nova aula
              </Button>
            </View>
          ) : null}
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          A busca olha título e descrição. O calendário filtra pela data de
          publicação. A lista atualiza sozinha.
        </Text>
      </View>

      {deletedTitle ? (
        <Alert variant="success" style={{ marginBottom: 16 }}>
          {`"${deletedTitle}" foi removida da lista.`}
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
          kicker="Lições"
          title={
            hasQuery ? 'Nenhuma aula encontrada' : 'Ainda não há postagens por aqui'
          }
          description={emptyDescription(search, hasDates)}
          action={
            isAdmin && !hasQuery ? (
              <Button
                variant="primary"
                onPress={() => router.push('/posts/new' as any)}
              >
                Escrever a primeira aula
              </Button>
            ) : null
          }
        />
      ) : (
        <View style={styles.list}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  datePickerWrap: {
    flex: 1,
  },
  actionWrap: {
    paddingTop: 0,
  },
  hiddenLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  composeBtn: {
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
