# Backup e recuperação

## O que precisa de backup

| Item | Local | Vercel |
| --- | --- | --- |
| Banco | `data/app.db` | Turso |
| Uploads | `data/uploads/` | Vercel Blob |
| Configuração | `.env` | Environment Variables |
| Imagens fixas | `public/images/` | Git |
| Código | Git | GitHub |

## Banco local (SQLite)

Com o servidor parado, copie:

```powershell
Copy-Item data\app.db backups\app-$(Get-Date -Format yyyyMMdd-HHmm).db
```

Ou use o backup consistente do SQLite:

```bash
sqlite3 data/app.db ".backup 'backups/app-2026-11-24.db'"
```

Inclua `app.db-wal` e `app.db-shm` apenas se existirem e o servidor estiver parado.

## Banco no Turso

Opções:

1. **Painel do Turso:** exportar/dump do banco.
2. **Point-in-time restore:** o plano Free mantém 1 dia de restauração.
3. **CLI do Turso** (quando instalado):
   ```bash
   turso db export palavra-viva backups/palavra-viva-2026-11-24.db
   ```

Guarde o arquivo fora do provedor.

## Uploads

### Local

```bash
tar -czf backups/uploads-2026-11-24.tar.gz -C data uploads
```

### Vercel Blob

- Use o painel da Vercel para baixar/exportar o store.
- Ou mantenha uma cópia dos arquivos originais em outro storage.

## Configuração

Guarde o `.env` em um gerenciador de senhas. Ele contém:

- senha do administrador;
- `SESSION_SECRET`;
- URL e token do Turso.

Não guarde o `.env` no Git.

## Restaurar SQLite

1. Pare o site.
2. Guarde o banco atual.
3. Copie o backup para `data/app.db`.
4. Remova `data/app.db-wal` e `data/app.db-shm` antigos.
5. Inicie o site e teste login, artigos e Bíblia.

## Restaurar Turso

1. Crie um banco novo ou limpe o atual.
2. Importe o dump pelo painel/CLI.
3. Atualize `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` se o banco mudou.
4. Faça novo deploy na Vercel.
5. Teste login, artigos e Bíblia.

## Restaurar uploads

1. Recrie a pasta `data/uploads` (local) ou o Blob store (Vercel).
2. Copie os arquivos.
3. Confira se os nomes batem com a tabela `media`.
4. Teste `/uploads/...`.

## Frequência recomendada

- Banco: diário.
- Uploads: semanal ou após envios importantes.
- `.env`: sempre que mudar.
- Teste de restauração: pelo menos uma vez por mês em ambiente separado.

## Verificação

Após restaurar:

- [ ] Login funciona.
- [ ] Artigos e categorias aparecem.
- [ ] Bíblia tem 66 livros e 31.102 versículos.
- [ ] Biblioteca e planos abrem.
- [ ] Uploads antigos abrem.
- [ ] Newsletter e comentários estão intactos.
- [ ] `SITE_URL` e HTTPS corretos.
