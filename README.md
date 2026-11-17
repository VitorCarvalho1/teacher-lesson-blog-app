# Teacher Lesson Blog

Aplicativo mobile (com suporte a web) para blog de aulas de professores, feito com React Native e Expo.

## Como iniciar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- npm
- (Opcional) Emulador Android, simulador iOS ou o app [Expo Go](https://expo.dev/go) no celular

### Passo a passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/VitorCarvalho1/teacher-lesson-blog-app.git
   cd teacher-lesson-blog-app
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o app:

   ```bash
   npx expo start
   ```

No terminal, escolha onde abrir: Expo Go, emulador Android, simulador iOS ou navegador.

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run android` | Abre no Android |
| `npm run ios` | Abre no iOS |
| `npm run web` | Abre no navegador |
| `npm run lint` | Verifica o código com ESLint |
| `npm run reset-project` | Move o código de exemplo e cria um `src/app` em branco |

## Tecnologias

| Tecnologia | |
| --- | --- |
| **React Native** | Criação de apps nativos iOS/Android com JavaScript |
| **React** | Biblioteca de interface baseada em componentes |
| **Expo** | Plataforma que facilita desenvolvimento, build e execução |
| **TypeScript** | JavaScript com tipagem estática |
| **ESLint** | Padronização e análise do código |

## Estrutura

```
├── assets/     # Imagens, fontes e outros recursos
├── scripts/    # Scripts auxiliares
├── src/app/    # Telas e rotas do app
└── app.json    # Configurações do Expo
```

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
