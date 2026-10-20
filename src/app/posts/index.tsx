import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';
import PostCard from '@/components/posts/PostCard';
import SearchField from '@/components/ui/SearchField';
import DateRangePicker, { DateRange } from '@/components/ui/DateRangePicker';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';

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
  const { isAdmin } = useAuth();
  const { posts } = useData();
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesDesc = post.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      if (dateRange.from || dateRange.to) {
        const postDate = new Date(post.created_at).toISOString().slice(0, 10);
        if (dateRange.from && postDate < dateRange.from) {
          return false;
        }
        if (dateRange.to && postDate > dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [posts, search, dateRange]);

  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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

      {total === 0 ? (
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
          {paginatedPosts.map((post) => (
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
  list: {
    paddingBottom: 24,
  },
});
