# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não publicado]

### Adicionado

- Estrutura de repositório GitHub com CI, Dependabot, templates de issue e Pull Request.
- Documentação separada de arquitetura, banco, segurança, backup, desenvolvimento e publicação.
- Licença MIT para o código e créditos de terceiros.
- `npm run typecheck` para validação de TypeScript.

### Alterado

- README reorganizado para o GitHub.
- Scripts de setup, importação da Bíblia e reset de administrador revisados.
- `.gitignore` cobre `.env`, banco local, uploads e artefatos de build.

### Removido

- Configurações e documentação de plataformas de nuvem.
- Scripts temporários de teste e QR Code de acesso local.

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
