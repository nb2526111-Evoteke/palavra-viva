# Arquitetura

## Visão geral

O Palavra Viva é uma aplicação **Next.js 16 (App Router)** com renderização no servidor,
Server Components, Server Actions e banco **SQLite** local. Todo o sistema roda em um
único processo Node.js:

- site público;
- painel administrativo;
- banco `data/app.db`;
- uploads em `data/uploads`.

Não há banco ou storage externo. O projeto foi desenhado para rodar em uma máquina
local ou em uma VPS com disco persistente.

## Camadas

```text
Navegador
   │
   ├─ páginas públicas (Server Components)
   ├─ painel /admin (Server Components + Server Actions)
   └─ formulários públicos (Server Actions)
          │
          ▼
src/lib/queries.ts  ──►  src/lib/db.ts  ──►  SQLite (node:sqlite)
src/lib/auth.ts     ──►  sessões no banco + cookie HMAC
src/lib/uploads.ts  ──►  src/lib/storage.ts  ──►  data/uploads
```

### Interface

- `src/app/(site)` contém as páginas públicas.
- `src/app/admin` contém login e painel.
- `src/components/site` e `src/components/admin` concentram a UI.
- O tema visual é aplicado por tokens CSS; a escolha do visitante fica em cookie.

### Dados

- `src/lib/db.ts` abre o SQLite, aplica o schema, executa o seed e expõe
  `queryAll`, `queryOne`, `execute`, `insert` e `transaction`.
- As funções são assíncronas para manter a mesma interface nas páginas e ações,
  embora o SQLite execute de forma síncrona.
- `src/lib/queries.ts` centraliza as consultas de leitura e algumas escritas.
- `src/lib/actions/*` concentra as Server Actions administrativas e públicas.
- O schema fica em `src/lib/schema.ts` e é aplicado com `CREATE TABLE IF NOT EXISTS`.

### Autenticação

- Apenas o administrador existe; não há cadastro público.
- Senhas usam `scrypt` com salt aleatório.
- O cookie `pv_session` guarda um token aleatório; o banco guarda apenas um
  HMAC-SHA-256 derivado de `SESSION_SECRET`.
- `src/proxy.ts` bloqueia `/admin` sem cookie; cada página e ação valida a sessão
  novamente com `requireAdmin`/`adminSession`.

### Uploads

- `src/lib/uploads.ts` valida tipo/tamanho e grava o registro na tabela `media`.
- `src/lib/storage.ts` grava e lê arquivos em `data/uploads`.
- A rota `/uploads/[...path]` entrega o arquivo com `Content-Type` e cache longo.

### Conteúdo e geradores

- `src/lib/theme-generator.ts` contém o currículo de temas e narrativas bíblicas.
- `src/lib/reference-theme.ts` detecta passagens no título e monta um estudo alinhado
  à referência informada.
- `src/lib/article-generator.ts` transforma um tema gerado em artigo Markdown.
- `src/lib/bible-reference.ts` resolve referências e busca o texto bíblico no banco.

## Fluxo de uma página pública

1. O Server Component chama funções de `src/lib/queries.ts`.
2. `db.ts` abre o SQLite, aplica o schema e faz o seed se o banco estiver vazio.
3. A consulta é executada localmente.
4. O HTML é renderizado no servidor e enviado ao navegador.
5. Componentes interativos (menu, leitor da Bíblia, formulários) hidratam no cliente.

## Fluxo do painel

1. `src/proxy.ts` verifica o cookie de sessão.
2. A página chama `requireAdmin()` e valida a sessão no banco.
3. A ação administrativa valida a sessão novamente, grava no banco e registra auditoria.
4. `revalidatePath` atualiza as rotas afetadas.
5. O usuário é redirecionado com mensagem de sucesso/erro.

## Decisões importantes

- **SQLite** em vez de um banco externo: simplicidade, backup por arquivo e zero custo.
- **node:sqlite** em vez de ORM: consultas explícitas e schema legível.
- **Server Actions** em vez de uma API REST separada: menos código e validação no servidor.
- **Uploads em disco**: simples de operar, desde que haja backup e disco persistente.
- **Sem cadastro público**: reduz superfície de ataque e mantém o blog editorial.
- **Tema por cookie**: cada visitante escolhe sua atmosfera de leitura sem conta.

## Limitações conhecidas

- O SQLite não é indicado para múltiplas instâncias concorrentes de escrita.
- O rate limiting é em memória por processo.
- A busca bíblica usa `LIKE`; para acervos muito maiores, considere FTS.
- Não há migrations versionadas; o schema é idempotente e evoluções devem ser compatíveis.
- O servidor precisa de disco persistente; ambientes serverless não servem para este modelo.
