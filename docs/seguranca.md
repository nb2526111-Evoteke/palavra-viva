# Segurança

## Autenticação

- Existe apenas o administrador; não há cadastro público.
- Senhas são armazenadas com **scrypt** e salt aleatório (`src/lib/password.ts`).
- O login aceita variantes do e-mail do administrador para tolerar erro de digitação
  (`rinaldo...`/`rrinaldo...`), sem criar contas.
- Tentativas de login são limitadas por e-mail/IP em memória (6 tentativas/15 min).
- O IP é obtido de `x-forwarded-for`/`x-real-ip` atrás do proxy.

## Sessões

- Token aleatório de 32 bytes no cookie `pv_session`.
- O banco guarda somente `HMAC-SHA-256(token, SESSION_SECRET)`.
- Validade de 7 dias; sessões expiradas são removidas.
- Cookie `httpOnly`, `SameSite=Lax`, `path=/` e `Secure` quando `SITE_URL` é HTTPS.
- Trocar a senha encerra as outras sessões.
- `SESSION_SECRET` deve ser longo e exclusivo. Sem ele, o fallback de desenvolvimento
  é inseguro e não deve ser usado em produção.

## Autorização

- `src/proxy.ts` bloqueia `/admin` sem cookie.
- Cada página chama `requireAdmin()`.
- Cada Server Action chama `adminSession()`.
- Rotas do painel são `noindex`.

## Formulários públicos

- Newsletter, comentários e contato usam Server Actions.
- Campos honeypot (`company`, `website`) e limite de envio por IP em memória.
- Comentários entram como pendentes e só aparecem após aprovação.
- Markdown é sanitizado antes de renderizar.

## Uploads

- Tipos permitidos: imagens, PDF, MP3, M4A, OGG, MP4 e TXT.
- Limite: 8 MB por arquivo.
- Nome gerado com timestamp + random + slug; extensão validada.
- Entrega pela rota `/uploads/[...path]`, com `Content-Type` e cache.
- Arquivos ficam em `data/uploads`, fora de `public/`.

## Cabeçalhos

`next.config.ts` envia:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Segredos

Nunca commite:

- `.env`
- `data/app.db`
- `data/uploads/`
- qualquer token ou senha

Use o `.env.example` como modelo.

## Checklist antes de publicar

- [ ] `ADMIN_PASSWORD` forte e exclusiva.
- [ ] `SESSION_SECRET` gerado com `openssl rand -hex 32`.
- [ ] `SITE_URL` com `https://`.
- [ ] HTTPS ativo.
- [ ] Repositório sem segredos.
- [ ] Backup do banco e uploads.
- [ ] Permissão de escrita apenas em `data/`.
- [ ] Login testado e senha inicial trocada.

## Rate limiting em escala

O limite atual é por processo (memória). Em várias instâncias, cada uma tem seu próprio
contador. Para escala maior, use um store compartilhado (Redis) ou uma tabela no banco
com janela deslizante.

## Resposta a incidentes

1. Troque a senha do administrador.
2. Gere novo `SESSION_SECRET` e reinicie o site (invalida sessões).
3. Revise `audit_logs` e os logs do servidor.
4. Se um segredo entrou no Git, considere-o comprometido e remova do histórico.
