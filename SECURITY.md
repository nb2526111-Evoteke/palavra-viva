# Política de segurança

## Versões suportadas

| Versão | Suporte |
| --- | --- |
| 1.x | Sim |

## Como relatar uma vulnerabilidade

**Não abra uma issue pública** para vulnerabilidades.

Use o recurso **Security → Report a vulnerability** do GitHub (Security Advisories)
neste repositório. Inclua:

- descrição do problema;
- passos para reproduzir;
- impacto estimado;
- versão/commit afetado;
- sugestão de correção, se houver.

Não inclua dados reais de usuários, senhas, tokens ou conteúdo do `.env`.

O retorno é feito em prazo razoável, conforme disponibilidade do mantenedor.

## Escopo

Fazem parte do escopo:

- autenticação e sessões do painel;
- autorização de rotas `/admin`;
- uploads e validação de arquivos;
- injeção de HTML/Markdown;
- exposição de segredos;
- falhas de configuração de cookies/HTTPS;
- acesso indevido ao banco ou ao armazenamento.

## Boas práticas já adotadas

- Senhas com scrypt e salt aleatório.
- Sessões com token aleatório e HMAC-SHA-256 no banco.
- Cookie `httpOnly`, `SameSite=Lax` e `Secure` quando `SITE_URL` usa HTTPS.
- Limite de tentativas de login por e-mail/IP.
- Middleware protegendo `/admin` e verificação de sessão em cada página.
- Sanitização de Markdown antes da renderização.
- Uploads com validação de MIME, extensão e tamanho.
- Cabeçalhos de segurança no `next.config.ts`.
- Rotas administrativas com `noindex`.

## Se você suspeitar de vazamento

1. Troque imediatamente a senha do administrador.
2. Gere um novo `SESSION_SECRET` e reinicie o site (invalida sessões).
3. Gere um novo token no Turso e atualize a Vercel.
4. Revise os logs de auditoria no painel.
5. Se o repositório for público, remova o segredo do histórico e considere o valor comprometido.
