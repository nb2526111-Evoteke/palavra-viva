# Arquitetura

## Visão geral

O Palavra Viva é uma aplicação **Next.js 16 (App Router)** com renderização no servidor,
Server Components, Server Actions e um banco SQLite/libSQL. O mesmo código roda:

- **localmente**, com banco em arquivo `data/app.db` e uploads em `data/uploads`;
- **na Vercel**, com banco no **Turso** e uploads no **Vercel Blob**;
- **em uma VPS**, com SQLite e uploads em disco persistente.

A escolha é feita por variáveis de ambiente, sem duas bases de código.

## Camadas

```text
Navegador
   │
   ├─ páginas públicas (Server Components)
   ├─ painel /admin (Server Components + Server Actions)
   └─ formulários públicos (Server Actions)
          │
          ▼
src/lib/queries.ts  ──►  src/lib/db.ts  ──►  libSQL local ou Turso
src/lib/auth.ts     ──►  sessões no banco + cookie HMAC
src/lib/uploads.ts  ──►  src/lib/storage.ts  ──►  disco local ou Vercel Blob
```

### Interface

- `src/app/(site)` contém as páginas públicas.
- `src/app/admin` contém login e painel.
- `src/components/site` e `src/components/admin` concentram a UI.
- O tema visual é aplicado por tokens CSS; a escolha do visitante fica em cookie.

### Dados

- `src/lib/db.ts` expõe `queryAll`, `queryOne`, `execute`, `insert` e `transaction`.
- Todas as operações são assíncronas para funcionar em serverless.
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
- `src/lib/storage.ts` escolhe o destino:
  - `BLOB_READ_WRITE_TOKEN` ou `BLOB_STORE_ID` → Vercel Blob;
  - caso contrário → `data/uploads`.
- A rota `/uploads/[...path]` entrega o arquivo com `Content-Type` e cache longo.

### Conteúdo e geradores

- `src/lib/theme-generator.ts` contém o currículo de temas e narrativas bíblicas.
- `src/lib/reference-theme.ts` detecta passagens no título e monta um estudo alinhado
  à referência informada.
- `src/lib/article-generator.ts` transforma um tema gerado em artigo Markdown.
- `src/lib/bible-reference.ts` resolve referências e busca o texto bíblico no banco.

## Fluxo de uma página pública

1. O Server Component chama funções de `src/lib/queries.ts`.
2. `db.ts` garante o schema (e o seed, no banco local vazio).
3. A consulta é executada no SQLite local ou no Turso.
4. O HTML é renderizado no servidor e enviado ao navegador.
5. Componentes interativos (menu, leitor da Bíblia, formulários) hidratam no cliente.

## Fluxo do painel

1. `src/proxy.ts` verifica o cookie de sessão.
2. A página chama `requireAdmin()` e valida a sessão no banco.
3. A ação administrativa valida a sessão novamente, grava no banco e registra auditoria.
4. `revalidatePath` atualiza as rotas afetadas.
5. O usuário é redirecionado com mensagem de sucesso/erro.

## Decisões importantes

- **SQLite/libSQL** em vez de um ORM: consultas explícitas, schema legível e facilidade
  de migrar entre arquivo local e Turso.
- **Server Actions** em vez de uma API REST separada: menos código e validação no servidor.
- **Vercel Blob** em vez de disco em produção: funções serverless não têm disco persistente.
- **Turso** em vez de Postgres: mantém o dialeto SQLite e simplifica a migração.
- **Sem cadastro público**: reduz superfície de ataque e mantém o blog editorial.
- **Tema por cookie**: cada visitante escolhe sua atmosfera de leitura sem conta.

## Limitações conhecidas

- Funções serverless têm limite de payload (4,5 MB neste projeto).
- O plano gratuito da Vercel e do Turso tem cotas mensais.
- Não há migrations versionadas; o schema é idempotente e evoluções devem ser compatíveis.
- A busca bíblica usa `LIKE`; para acervos muito maiores, considere FTS.
- O rate limiting é em memória por instância; em escala, use um store compartilhado.
