# Documentação

Este diretório reúne a documentação técnica e operacional do Palavra Viva.

## Comece por aqui

| Documento | Para quê |
| --- | --- |
| [Arquitetura](arquitetura.md) | Entender como o site, o banco, a autenticação e os uploads funcionam. |
| [Banco de dados](banco-de-dados.md) | Schema, tabelas, Turso, migrações e consultas. |
| [Implantação na Vercel](implantacao-vercel.md) | Publicar de graça com Vercel + Turso + Vercel Blob. |
| [Implantação em VPS](implantacao-vps.md) | Rodar com SQLite e disco persistente em um servidor Node. |
| [Painel administrativo](painel-administrativo.md) | Operar artigos, biblioteca, comentários, mídia e configurações. |
| [Geradores de conteúdo](geradores-de-conteudo.md) | Criar temas e artigos alinhados a uma passagem bíblica. |
| [Segurança](seguranca.md) | Autenticação, sessões, uploads, cabeçalhos e checklist. |
| [Backup e recuperação](backup-e-recuperacao.md) | Proteger e restaurar banco, uploads e configuração. |
| [Desenvolvimento](desenvolvimento.md) | Padrões de código, scripts e como estender o projeto. |
| [Bíblia e licenças](biblia-e-licencas.md) | Fonte, importação, atribuição e licenças de terceiros. |

## Versão rápida

```bash
npm ci
cp .env.example .env
# edite .env
npm run db:setup
npm run dev
```

- Site: http://localhost:3000
- Painel: http://localhost:3000/admin
- Login: http://localhost:3000/admin/login
