# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não publicado]

### Adicionado

- Suporte a banco remoto libSQL/Turso com o mesmo schema SQLite.
- Suporte a uploads no Vercel Blob em produção, mantendo o disco local em desenvolvimento.
- Documentação separada de arquitetura, banco, segurança, backup e implantação.
- CI no GitHub Actions com typecheck, preparação do banco e build.
- Templates de issue, Pull Request, Dependabot e política de segurança.
- Licença MIT para o código e créditos de terceiros.

### Alterado

- Camada de banco convertida para operações assíncronas compatíveis com serverless.
- Scripts de setup, importação da Bíblia, reset de administrador e migração para Turso.
- README reorganizado para o GitHub.
- Limite de upload padronizado em 4,5 MB em produção.

### Removido

- Configurações específicas de Netlify e Discloud.
- Scripts temporários de teste e QR Code de acesso local.
- Dependência `@netlify/blobs`.

## [1.0.0] - 2026-11-24

### Adicionado

- Site público completo: home, blog, categorias, artigos, busca, sobre, contato, RSS,
  sitemap, robots e página 404.
- Bíblia completa com 66 livros, 1.189 capítulos e 31.102 versículos.
- Leitura com controle de tamanho de fonte, notas de estudo e referências clicáveis.
- Biblioteca digital e planos de leitura.
- Painel administrativo privado com dashboard, artigos, categorias, comentários,
  biblioteca, planos, temas, mídia, newsletter, mensagens, auditoria e configurações.
- Gerador de temas com contexto histórico, narrativas, reis, esboço, aplicações e oração.
- Gerador de artigos a partir de tema ou passagem bíblica.
- Autenticação com scrypt, sessões HMAC e limitação de tentativas.
- Layout responsivo para Android, iOS, Windows e navegadores modernos.
