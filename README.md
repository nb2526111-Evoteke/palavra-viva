# Palavra Viva

> **Fé que pensa. Esperança que age.**

Blog bíblico completo com Bíblia em português, biblioteca digital, planos de leitura,
geradores de estudos e um painel administrativo privado.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org)
[![CI](https://github.com/nb2526111-Evoteke/palavra-viva/actions/workflows/ci.yml/badge.svg)](https://github.com/nb2526111-Evoteke/palavra-viva/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/licen%C3%A7a-MIT-2ea44f)](LICENSE)

---

## Visão geral

O Palavra Viva reúne, em um único projeto:

- um site editorial público;
- a Bíblia Livre completa (66 livros, 1.189 capítulos, 31.102 versículos);
- biblioteca de ebooks, estudos, devocionais e podcasts;
- planos de leitura dia a dia;
- gerador de temas com contexto histórico, narrativas, reis, esboço e referências;
- gerador de artigos a partir de um tema ou passagem bíblica;
- painel administrativo com artigos, comentários, mídia, newsletter e auditoria.

Tudo roda em um único servidor Node.js, com **SQLite** e **uploads em disco**.
Não há dependência de banco ou storage externo.

O acesso administrativo é exclusivo: **não existe cadastro público**.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **SQLite** via `node:sqlite`
- **Node.js 22.13+**
- **PM2 + Nginx** para publicação em VPS (opcional)

## Funcionalidades

### Site público

- Home editorial com destaque, últimos artigos, versículo do dia e newsletter.
- Blog com busca, categorias, tags e paginação.
- Artigo com Markdown, capa, tempo de leitura, compartilhamento, comentários e
  artigos relacionados.
- Bíblia com navegação por livro/capítulo, busca e notas de estudo por toque/hover.
- Biblioteca e planos de leitura.
- Sobre, contato, busca global, RSS, sitemap, robots e página 404.
- Layout responsivo para Android, iOS, Windows e navegadores modernos.

### Painel administrativo

- Dashboard com métricas, gráfico de leituras, comentários pendentes e auditoria.
- Editor de artigos com Markdown, prévia, capa, slug, agendamento, destaque,
  tags e SEO.
- Gerador de artigo por tema/passagem.
- Gerador de temas com narrativas bíblicas, esboço, aplicações, oração e mensagem do dia.
- Categorias, comentários, biblioteca, planos e versículos do dia.
- Gerenciador de temas com prévia ao vivo.
- Mídia com upload e texto alternativo.
- Newsletter com CSV, mensagens de contato e auditoria.
- Configurações do site, perfil e troca de senha.

## Abrir no GitHub Codespaces

O Codespaces roda o blog completo na nuvem do GitHub, com SQLite e uploads dentro do
ambiente. É a forma de acessar o projeto pelo GitHub sem instalar nada no computador.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/nb2526111-Evoteke/palavra-viva)

1. Clique no botão acima e crie o Codespace.
2. Aguarde a instalação e a importação da Bíblia (1–2 minutos).
3. Abra o arquivo `CREDENCIAIS-CODESPACE.txt` para ver e-mail e senha do administrador.
4. A porta 3000 abre automaticamente. Se não abrir, use a aba **Ports** e clique no
   endereço da porta 3000.
5. Acesse `/admin` e entre com as credenciais do arquivo.

### Banco e uploads no Codespaces

- Banco: `data/app.db`
- Uploads: `data/uploads/`

Eles ficam dentro do Codespace e **persistem** ao parar, iniciar ou reconstruir o
mesmo Codespace. São perdidos apenas se o Codespace for excluído.

Para baixar uma cópia consistente do banco:

```bash
npm run db:backup
```

O arquivo é criado em `backups/app-....db`. Clique com o botão direito nele no
explorador de arquivos e escolha **Download**.

Para os uploads:

```bash
tar -czf backups/uploads-$(date +%F).tar.gz -C data uploads
```

Para usar o banco do seu computador no Codespace, pare o servidor, envie o arquivo
`data/app.db` para `data/` no Codespace (arrastar e soltar) e inicie novamente.

> O Codespaces é **temporário** e usa a cota gratuita do GitHub. Para um site público
> permanente, é necessário um servidor com disco persistente (VPS).

## Começando

### Requisitos

- Node.js **22.13+** (veja `.nvmrc`)
- npm 10+
- Git

### Instalação

```bash
git clone https://github.com/nb2526111-Evoteke/palavra-viva.git
cd palavra-viva
npm ci
cp .env.example .env
```

Edite o `.env`:

```env
ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD=uma-senha-forte-com-10-ou-mais-caracteres
ADMIN_NAME=Seu Nome
SESSION_SECRET=uma-string-aleatoria-longa
SITE_URL=http://localhost:3000
```

Gere um segredo de sessão:

```bash
openssl rand -hex 32
```

Prepare o banco e a Bíblia:

```bash
npm run db:setup
npm run dev
```

- Site: http://localhost:3000
- Painel: http://localhost:3000/admin
- Login: http://localhost:3000/admin/login

Use o e-mail e a senha definidos em `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o desenvolvimento em `http://localhost:3000`. |
| `npm run build` | Gera a versão de produção. |
| `npm start` | Sobe a versão de produção. |
| `npm run typecheck` | Verifica TypeScript sem gerar arquivos. |
| `npm run db:setup` | Cria o schema, o conteúdo inicial e importa a Bíblia. |
| `npm run db:backup` | Cria uma cópia consistente do banco em `backups/`. |
| `npm run bible:import` | Reimporta a Bíblia. |
| `npm run admin:reset` | Redefine o administrador e encerra sessões. |

## Estrutura

```text
.
├─ .github/              # CI, Dependabot, issues e PR template
├─ data/
│  ├─ source/            # Bíblia Livre (SQLite + metadados)
│  └─ uploads/           # uploads locais (ignorados no Git)
├─ docs/                 # documentação técnica e operacional
├─ public/
│  └─ images/temas/      # capas dos temas
├─ scripts/              # setup, importação, reset e utilitários
├─ src/
│  ├─ app/               # páginas, painel, API e uploads
│  ├─ components/        # UI pública, admin e bíblia
│  └─ lib/               # banco, consultas, auth, ações e geradores
├─ .env.example
├─ LICENSE
├─ NOTICE.md
├─ package.json
└─ README.md
```

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [Arquitetura](docs/arquitetura.md) | Como o site, o banco, a autenticação e os uploads funcionam. |
| [Banco de dados](docs/banco-de-dados.md) | Schema, tabelas, inicialização e backup. |
| [Publicação em VPS](docs/implantacao-vps.md) | Node, PM2, Nginx, HTTPS e SQLite. |
| [Painel administrativo](docs/painel-administrativo.md) | Como operar o blog. |
| [Geradores de conteúdo](docs/geradores-de-conteudo.md) | Temas e artigos alinhados à passagem. |
| [Segurança](docs/seguranca.md) | Sessões, uploads, cabeçalhos e checklist. |
| [Backup e recuperação](docs/backup-e-recuperacao.md) | Proteger e restaurar dados. |
| [Desenvolvimento](docs/desenvolvimento.md) | Convenções e como estender o projeto. |
| [Bíblia e licenças](docs/biblia-e-licencas.md) | Fonte, importação e atribuição. |

## Publicação

O projeto é feito para rodar em um servidor Node.js com disco persistente:

```bash
npm ci
npm run db:setup
npm run build
npm start
```

Em produção:

- use HTTPS e um proxy reverso (Nginx/Caddy);
- mantenha `data/` e `.env` fora do Git;
- faça backup de `data/app.db` e `data/uploads`;
- rode com PM2, systemd ou Docker.

Guia completo: [docs/implantacao-vps.md](docs/implantacao-vps.md).

## Segurança

- Senhas com **scrypt** e salt aleatório.
- Sessões com token aleatório e HMAC-SHA-256 no banco.
- Cookie `httpOnly`, `SameSite=Lax` e `Secure` com HTTPS.
- Rate limiting de login e formulários públicos.
- Middleware + verificação de sessão em todas as páginas do painel.
- Markdown sanitizado.
- Uploads com validação de tipo e tamanho.
- Cabeçalhos de segurança no `next.config.ts`.

Nunca commite `.env`, `data/app.db` ou uploads.
Leia [docs/seguranca.md](docs/seguranca.md).

## Bíblia e licenças

- **Bíblia Livre (BLIVRE)** — CC BY 4.0 BR. A atribuição é obrigatória.
- Código — MIT (`LICENSE`).
- Fotos — Unsplash License.
- Ícones — Lucide (ISC).
- Fontes — SIL OFL 1.1.
- Conteúdo editorial — © Palavra Viva.

Detalhes em [NOTICE.md](NOTICE.md) e [docs/biblia-e-licencas.md](docs/biblia-e-licencas.md).

## Contribuindo

Leia [CONTRIBUTING.md](CONTRIBUTING.md). Para vulnerabilidades, siga
[SECURITY.md](SECURITY.md) e não abra issue pública.

---

**Palavra Viva** — leia com calma, pergunte sem medo e volte sempre.
