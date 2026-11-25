# Implantação na Vercel

Guia para publicar gratuitamente com **Vercel Hobby + Turso + Vercel Blob**.

## Arquitetura de produção

```text
GitHub → Vercel (build/deploy)
              ├─ Next.js (funções serverless)
              ├─ Turso (banco libSQL)
              └─ Vercel Blob (uploads)
```

## Requisitos

- Conta no GitHub.
- Conta na Vercel (login com GitHub).
- Conta no Turso (login com GitHub ou e-mail).
- Node.js 22.13+ apenas para desenvolvimento local.

## 1. Criar o banco no Turso

1. Acesse https://app.turso.tech/signup.
2. Entre com GitHub.
3. Crie o banco `palavra-viva`.
4. Copie a **Database URL**.
5. Crie um **token de leitura e escrita**.
6. Salve `.env.turso` na raiz do projeto:

```env
TURSO_DATABASE_URL=https://palavra-viva-seunome.turso.io
TURSO_AUTH_TOKEN=seu-token
```

> Use `https://` na URL de produção. O cliente HTTP é mais estável em funções
> serverless do que o WebSocket de `libsql://`.

## 2. Migrar o conteúdo

```bash
npm run db:migrate
```

O script lê automaticamente `.env` e `.env.turso`. Se preferir, exporte as variáveis
manualmente no terminal antes de rodar.

O script copia artigos, Bíblia, biblioteca, planos, temas, newsletter, mídia,
auditoria e configurações, e confere as contagens.

Para recriar o banco remoto:

```powershell
$env:FORCE_MIGRATION = "1"
npm run db:migrate
```

## 3. Enviar o código ao GitHub

```bash
git init
git add .
git commit -m "chore: versão inicial"
gh repo create SEU-USUARIO/palavra-viva --private --source=. --push
```

Confirme que `.env`, `.env.turso` e `data/app.db` **não** foram commitados.

## 4. Importar na Vercel

1. Acesse https://vercel.com/new.
2. Importe o repositório `palavra-viva`.
3. Framework: **Next.js** (detectado automaticamente).
4. Build Command: `npm run build`.
5. Output Directory: padrão.
6. Ainda não clique em Deploy se as variáveis não estiverem configuradas.

## 5. Criar o Vercel Blob

1. No projeto da Vercel: **Storage → Blob**.
2. Crie um store chamado `palavra-viva-uploads`.
3. Conecte ao projeto.
4. A Vercel injeta `BLOB_READ_WRITE_TOKEN` (ou `BLOB_STORE_ID` + OIDC).

Sem esse store, os uploads tentam gravar em disco e falham em produção.

## 6. Variáveis de ambiente

Em **Project → Settings → Environment Variables** (Production):

| Variável | Exemplo | Obrigatória |
| --- | --- | --- |
| `TURSO_DATABASE_URL` | `https://palavra-viva.turso.io` | Sim |
| `TURSO_AUTH_TOKEN` | token do Turso | Sim |
| `SESSION_SECRET` | string aleatória longa | Sim |
| `ADMIN_EMAIL` | seu e-mail | Sim |
| `ADMIN_PASSWORD` | senha com 10+ caracteres | Sim |
| `ADMIN_NAME` | seu nome | Sim |
| `SITE_URL` | `https://palavra-viva.vercel.app` | Sim |
| `BLOB_READ_WRITE_TOKEN` | criado pelo Blob | Automático |

Gere um segredo de sessão:

```bash
openssl rand -hex 32
```

## 7. Deploy

Pelo painel: **Deploy**.
Ou pelo CLI:

```bash
npx vercel login
npx vercel --prod
```

Após o primeiro deploy:

1. Copie a URL publicada.
2. Atualize `SITE_URL` para ela.
3. Faça um novo deploy.
4. Acesse `/admin`, entre e troque a senha.

## 8. Domínio próprio

1. Na Vercel: **Project → Settings → Domains**.
2. Adicione `seudominio.com.br` e `www.seudominio.com.br`.
3. Configure no registrador os registros DNS indicados.
4. Atualize `SITE_URL=https://seudominio.com.br`.
5. Faça novo deploy.

O HTTPS é automático. O domínio `sites-bloog.app` só funcionará depois de registrado
e com DNS apontando para a Vercel.

## 9. Limites do plano gratuito

- Vercel Hobby: 1 GB de Blob, 10 GB de transferência, 1 milhão de invocações e
  4 horas de CPU ativa por mês.
- Funções: payload de até 4,5 MB; o upload do painel respeita esse limite.
- Turso Free: 5 GB, 500 milhões de leituras e 10 milhões de escritas por mês.
- Cold start: a primeira requisição após inatividade pode demorar alguns segundos.

## 10. Atualizações

Com o repositório conectado, cada push em `main` gera um novo deploy.
O banco no Turso e os arquivos no Blob **não** são apagados pelo deploy.

## 11. Problemas comuns

**Upload falha**
Confira o Blob store conectado e o limite de 4,5 MB.

**Erro de banco/tabela vazia**
Confira as variáveis do Turso e rode `npm run db:migrate`.

**Login volta para a tela de login**
Confira `SITE_URL` com `https://`, `SESSION_SECRET` e se o deploy ocorreu após
configurar as variáveis.

**Build falha**
Rode localmente `npm run typecheck` e `npm run build`. Confira os logs da Vercel.
O build consulta o Turso para gerar o sitemap; as variáveis precisam existir no
ambiente de build.

## 12. Checklist pós-deploy

- [ ] Home, blog, artigo, Bíblia, biblioteca, sobre, contato e busca abrem.
- [ ] Login em `/admin` funciona.
- [ ] É possível criar e editar um artigo.
- [ ] Upload de imagem aparece em `/uploads/...`.
- [ ] Newsletter grava um e-mail de teste.
- [ ] Comentário entra como pendente e pode ser aprovado.
- [ ] `/feed.xml`, `/sitemap.xml` e `/robots.txt` respondem.
- [ ] Layout mobile sem overflow.
- [ ] `SITE_URL` e canonical corretos.
