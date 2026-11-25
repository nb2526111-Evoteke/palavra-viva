# Como contribuir

Obrigado pelo interesse no Palavra Viva. Este repositório é um projeto pessoal de blog,
mas contribuições bem descritas são bem-vindas.

## Antes de começar

- Verifique se já existe uma issue parecida.
- Para mudanças grandes, abra uma issue de discussão antes de implementar.
- Nunca envie `.env`, tokens, banco local (`data/app.db`) ou uploads.

## Ambiente local

```bash
# Node.js 22.13+
node --version

npm ci
cp .env.example .env
# edite .env

npm run db:setup
npm run dev
```

Site: http://localhost:3000
Painel: http://localhost:3000/admin

## Fluxo de trabalho

1. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feat/minha-melhoria
   ```
2. Faça mudanças pequenas e focadas.
3. Rode:
   ```bash
   npm run typecheck
   npm run build
   ```
4. Teste o site público e o painel no desktop e no mobile.
5. Abra um Pull Request usando o template.

## Commits

Use mensagens no padrão **Conventional Commits**:

```text
feat: adiciona filtro por ano na biblioteca
fix: corrige overflow do menu mobile
docs: atualiza guia de implantação
refactor: simplifica consultas de artigos
chore: atualiza dependências
```

## Estilo de código

- TypeScript estrito; evite `any` sem necessidade.
- Siga o padrão existente de pastas e nomes.
- Componentes de servidor por padrão; use `"use client"` apenas quando necessário.
- Consultas ao banco ficam em `src/lib/queries.ts` ou em funções específicas do módulo.
- Ações administrativas ficam em `src/lib/actions/`.
- Textos de interface em português do Brasil.
- Preserve a atribuição da Bíblia Livre.

## Banco de dados

- O schema fica em `src/lib/schema.ts`.
- O banco local é criado por `npm run db:setup`.
- Mudanças de schema devem ser compatíveis com instalações existentes
  (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE` quando necessário).
- Teste também com o banco vazio: remova `data/app.db` em uma cópia do projeto e rode
  `npm run db:setup`.

## Segurança

- Não inclua segredos em código, testes, prints ou issues.
- Para vulnerabilidades, siga `SECURITY.md` e não abra issue pública.
- Uploads devem validar tipo e tamanho.
- Toda rota `/admin` deve continuar protegida pelo middleware e pela verificação de sessão.

## Licença

Ao contribuir com código, você concorda que a contribuição será distribuída sob a
licença MIT do projeto. Conteúdo editorial e textos bíblicos têm licenças próprias
(ver `NOTICE.md`).
