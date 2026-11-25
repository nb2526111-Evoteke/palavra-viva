# Banco de dados

## Tecnologia

O projeto usa **SQLite** via `node:sqlite`, incluído no Node.js 22.13+.
O banco é um arquivo local em `data/app.db`.

- Schema: `src/lib/schema.ts`
- Acesso: `src/lib/db.ts`
- Consultas: `src/lib/queries.ts`
- Seed: `src/lib/seed.ts`
- Fonte da Bíblia: `data/source/almeida-livre.sqlite`

Não há banco externo, ORM ou serviço de nuvem.

## Tabelas

### Conteúdo editorial

| Tabela | Função |
| --- | --- |
| `posts` | Artigos, rascunhos, agendados, capa, SEO, views. |
| `categories` | Categorias do blog. |
| `tags` | Tags normalizadas. |
| `post_tags` | Relação artigo ↔ tag. |
| `comments` | Comentários moderados. |
| `post_views` | Contagem diária de leituras por artigo. |

### Biblioteca e planos

| Tabela | Função |
| --- | --- |
| `library_items` | Ebooks, estudos, devocionais e podcasts. |
| `reading_plans` | Planos de leitura. |
| `reading_plan_days` | Dias de cada plano, com passagem e reflexão. |
| `generated_themes` | Conteúdo completo dos temas gerados (JSON). |
| `daily_messages` | Mensagem do dia publicada na home. |

### Bíblia

| Tabela | Função |
| --- | --- |
| `bible_books` | 66 livros, posição, testamento, capítulos. |
| `bible_verses` | 31.102 versículos com `search_text` sem acentos. |
| `daily_verses` | Rotação de versículos do dia. |

### Site e operação

| Tabela | Função |
| --- | --- |
| `settings` | Configurações chave/valor do site. |
| `users` | Administrador (nome, e-mail, hash, bio, avatar). |
| `sessions` | Sessões ativas (HMAC do token, validade, IP, user agent). |
| `newsletter_subscribers` | Inscritos e status. |
| `contact_messages` | Mensagens do formulário de contato. |
| `media` | Metadados dos uploads. |
| `themes` | Temas visuais e tokens CSS. |
| `audit_logs` | Auditoria de ações administrativas. |

## Relacionamentos principais

```text
categories 1 ── N posts
users      1 ── N posts
posts      1 ── N comments
posts      N ── N tags (post_tags)
reading_plans 1 ── N reading_plan_days
library_items 1 ── N generated_themes
generated_themes 1 ── N daily_messages
bible_books 1 ── N bible_verses
```

## Inicialização

```bash
npm run db:setup
```

O comando:

1. cria o schema se necessário;
2. insere configurações, administrador, temas, categorias e conteúdo demonstrativo
   quando o banco está vazio;
3. importa os 31.102 versículos de `data/source/almeida-livre.sqlite`.

O processo é idempotente: se `settings.seeded = 1`, não duplica o conteúdo.

## Reimportar a Bíblia

```bash
npm run bible:import
```

O importador lê `data/source/almeida-livre.sqlite` e grava livros e versículos.
A tabela de origem precisa ter `book_id`, `chapter`, `number` e `text`.

## Redefinir o administrador

```bash
npm run admin:reset
```

Usa `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME` do `.env`, encerra as sessões antigas
e registra a ação na auditoria.

## Recomeçar do zero

> Isso apaga artigos, configurações, mídia e inscritos.

```powershell
# pare o servidor
Remove-Item data\app.db, data\app.db-shm, data\app.db-wal -ErrorAction SilentlyContinue
Remove-Item data\uploads\* -Recurse -Force -ErrorAction SilentlyContinue
npm run db:setup
```

## Backup

Com o servidor parado, copie:

- `data/app.db`
- `data/app.db-wal` e `data/app.db-shm` (se existirem)
- `data/uploads/`
- `.env`

Ou use o backup consistente:

```bash
sqlite3 data/app.db ".backup 'backups/app-2026-11-24.db'"
```

Detalhes em [backup-e-recuperacao.md](backup-e-recuperacao.md).

## Evolução do schema

Não há migrations versionadas. Ao alterar `src/lib/schema.ts`:

1. mantenha compatibilidade com bancos existentes;
2. use `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS`;
3. para novas colunas, adicione `ALTER TABLE ... ADD COLUMN` em um script idempotente;
4. teste com banco vazio e com banco já populado;
5. atualize esta documentação.
