# Backup e recuperação

## O que precisa de backup

| Item | Caminho |
| --- | --- |
| Banco | `data/app.db` (+ `-wal`/`-shm` se existirem) |
| Uploads | `data/uploads/` |
| Configuração | `.env` |
| Imagens fixas | `public/images/` (também versionadas no Git) |
| Código | Git/GitHub |

## Banco

Com o servidor parado:

```powershell
Copy-Item data\app.db backups\app-$(Get-Date -Format yyyyMMdd-HHmm).db
```

Ou com backup consistente:

```bash
sqlite3 data/app.db ".backup 'backups/app-2026-11-24.db'"
```

Inclua `app.db-wal` e `app.db-shm` apenas se existirem e o servidor estiver parado.

## Uploads

```bash
tar -czf backups/uploads-2026-11-24.tar.gz -C data uploads
```

No Windows:

```powershell
Compress-Archive -Path data\uploads\* -DestinationPath backups\uploads-$(Get-Date -Format yyyyMMdd).zip
```

## Configuração

Guarde o `.env` em um gerenciador de senhas. Ele contém:

- senha do administrador;
- `SESSION_SECRET`.

Não guarde o `.env` no Git.

## Restaurar

1. Pare o site.
2. Guarde o estado atual (se possível).
3. Copie o backup para `data/app.db`.
4. Remova `data/app.db-wal` e `data/app.db-shm` antigos.
5. Restaure `data/uploads`.
6. Restaure o `.env` se necessário.
7. Inicie o site e teste.

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
