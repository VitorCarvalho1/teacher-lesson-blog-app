import { Comment } from '@/types/comment';
import { Post } from '@/types/post';
import { User } from '@/types/auth';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Prof. Henrique Viana',
    email: 'henrique.viana@escola.edu.br',
    role: 'ADMIN',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
  },
  {
    id: 2,
    name: 'Profa. Mariana Bastos',
    email: 'mariana.bastos@escola.edu.br',
    role: 'ADMIN',
    created_at: '2024-04-15T11:20:00Z',
    updated_at: '2024-04-15T11:20:00Z',
  },
  {
    id: 3,
    name: 'Lucas Albuquerque',
    email: 'lucas.albuquerque@aluno.escola.edu.br',
    role: 'USER',
    created_at: '2024-05-20T14:30:00Z',
    updated_at: '2024-05-20T14:30:00Z',
  },
  {
    id: 4,
    name: 'Beatriz Nogueira',
    email: 'beatriz.nogueira@aluno.escola.edu.br',
    role: 'USER',
    created_at: '2024-06-02T16:15:00Z',
    updated_at: '2024-06-02T16:15:00Z',
  },
  {
    id: 5,
    name: 'Carlos Eduardo Dias',
    email: 'carlos.dias@aluno.escola.edu.br',
    role: 'USER',
    created_at: '2024-07-14T08:45:00Z',
    updated_at: '2024-07-14T08:45:00Z',
  },
  {
    id: 6,
    name: 'Fernanda Lima',
    email: 'fernanda.lima@aluno.escola.edu.br',
    role: 'USER',
    created_at: '2024-08-01T10:00:00Z',
    updated_at: '2024-08-01T10:00:00Z',
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: 'Rotina de leitura no início da aula',
    description:
      'Nesta aula discutimos a importância dos primeiros 15 minutos dedicados à leitura silenciosa e compartilhamento de impressões. A metodologia estimula a concentração, enriquece o vocabulário e prepara os estudantes para as atividades conceituais seguintes. Recomenda-se disponibilizar uma caixa com livros de diferentes gêneros e permitir a livre escolha nas primeiras duas semanas.',
    status: 'PUBLISHED',
    user_id: 1,
    author: {
      id: 1,
      name: 'Prof. Henrique Viana',
      email: 'henrique.viana@escola.edu.br',
    },
    created_at: '2026-03-12T08:30:00Z',
    updated_at: '2026-03-12T08:30:00Z',
  },
  {
    id: 2,
    title: 'Introdução à Programação com TypeScript e React',
    description:
      'Guia prático para os primeiros passos com tipagem estática no frontend moderno. Abordamos componentes funcionais, tipagem de props, hooks essenciais (useState, useEffect) e boas práticas de arquitetura limpa em sala de aula. Cada estudante desenvolveu uma pequena aplicação de lista de tarefas tipada com validação em tempo real.',
    status: 'PUBLISHED',
    user_id: 1,
    author: {
      id: 1,
      name: 'Prof. Henrique Viana',
      email: 'henrique.viana@escola.edu.br',
    },
    created_at: '2026-03-18T14:00:00Z',
    updated_at: '2026-03-18T14:00:00Z',
  },
  {
    id: 3,
    title: 'Experimentos Práticos de Física: Movimento Uniforme',
    description:
      'Orientações para o laboratório de cinemática com cronômetros e carrinhos em trilhos inclinados. Análise gráfica de tempo vs. deslocamento e cálculo da velocidade escalar média. Os grupos registraram os dados em planilhas compartilhadas e apresentaram conclusões sobre o atrito dinâmico.',
    status: 'PUBLISHED',
    user_id: 2,
    author: {
      id: 2,
      name: 'Profa. Mariana Bastos',
      email: 'mariana.bastos@escola.edu.br',
    },
    created_at: '2026-03-22T10:15:00Z',
    updated_at: '2026-03-22T10:15:00Z',
  },
  {
    id: 4,
    title: 'História Contemporânea: A Revolução Digital e a Sociedade',
    description:
      'Debate interdisciplinar sobre os impactos da internet, redes sociais e automação nas relações de trabalho e na democracia ao longo das últimas três décadas. Foram analisados recortes de jornais de 1995 a 2025 para identificar as mudanças de perspectiva sobre tecnologia e trabalho remoto.',
    status: 'PUBLISHED',
    user_id: 2,
    author: {
      id: 2,
      name: 'Profa. Mariana Bastos',
      email: 'mariana.bastos@escola.edu.br',
    },
    created_at: '2026-03-29T15:45:00Z',
    updated_at: '2026-03-29T15:45:00Z',
  },
  {
    id: 5,
    title: 'Oficina de Escrita Acadêmica e Argumentação Crítica',
    description:
      'Estrutura clássica de redação dissertativo-argumentativa: introdução com tese clara, parágrafos de desenvolvimento com repertório legitimado e proposta de intervenção detalhada com agente, ação, meio e efeito. Revisão em pares realizada na segunda metade da aula com fichas avaliativas padronizadas.',
    status: 'PUBLISHED',
    user_id: 1,
    author: {
      id: 1,
      name: 'Prof. Henrique Viana',
      email: 'henrique.viana@escola.edu.br',
    },
    created_at: '2026-04-05T09:00:00Z',
    updated_at: '2026-04-05T09:00:00Z',
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    content:
      'Excelente metodologia, professor! Já apliquei na turma do 8º ano e o engajamento aumentou visivelmente.',
    post_id: 1,
    user_id: 2,
    author: {
      id: 2,
      name: 'Profa. Mariana Bastos',
      role: 'ADMIN',
    },
    created_at: '2026-03-13T10:15:00Z',
    updated_at: '2026-03-13T10:15:00Z',
  },
  {
    id: 2,
    content:
      'Gostei muito da sugestão de registrar as palavras desconhecidas no caderno de vocabulário. Foi muito útil!',
    post_id: 1,
    user_id: 3,
    author: {
      id: 3,
      name: 'Lucas Albuquerque',
      role: 'USER',
    },
    created_at: '2026-03-13T14:30:00Z',
    updated_at: '2026-03-13T14:30:00Z',
  },
  {
    id: 3,
    content:
      'Os exemplos práticos com interfaces facilitaram muito a compreensão das props opcionais e do autocompletion.',
    post_id: 2,
    user_id: 4,
    author: {
      id: 4,
      name: 'Beatriz Nogueira',
      role: 'USER',
    },
    created_at: '2026-03-19T09:40:00Z',
    updated_at: '2026-03-19T09:40:00Z',
  },
  {
    id: 4,
    content:
      'Poderíamos ter uma continuação focada em React Native e navegação mobile com Expo Router?',
    post_id: 2,
    user_id: 5,
    author: {
      id: 5,
      name: 'Carlos Eduardo Dias',
      role: 'USER',
    },
    created_at: '2026-03-19T11:20:00Z',
    updated_at: '2026-03-19T11:20:00Z',
  },
];
