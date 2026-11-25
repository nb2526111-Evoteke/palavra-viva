# Implantação em VPS

Guia para rodar o Palavra Viva com **SQLite e uploads em disco persistente**.
Recomendado para quem quer controle total e não depende de cotas serverless.

## Requisitos

- VPS Ubuntu 22.04/24.04 ou Debian 12.
- Node.js 22.13+.
- 1 GB de RAM (2 GB recomendado para o build).
- 2 GB de disco livres.
- Domínio apontando para o IP da VPS (para HTTPS).

## 1. Preparar o servidor

```bash
ssh root@IP_DA_VPS
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx unzip sqlite3
node --version
```

Crie o usuário e a pasta:

```bash
adduser --disabled-password --gecos "" palavra
mkdir -p /var/www/palavra-viva
chown -R palavra:palavra /var/www/palavra-viva
```

## 2. Enviar o projeto

No seu computador:

```bash
scp palavra-viva.zip root@IP_DA_VPS:/tmp/
```

No servidor:

```bash
unzip /tmp/palavra-viva.zip -d /var/www/palavra-viva
chown -R palavra:palavra /var/www/palavra-viva
cd /var/www/palavra-viva
```

Alternativa: clonar o repositório do GitHub.

## 3. Configurar o `.env`

```bash
nano /var/www/palavra-viva/.env
```

```env
ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD=sua-senha-forte
ADMIN_NAME=Seu Nome
SESSION_SECRET=uma-string-aleatoria-longa
SITE_URL=http://seudominio.com.br
```

Proteja:

```bash
chown palavra:palavra /var/www/palavra-viva/.env
chmod 600 /var/www/palavra-viva/.env
```

> Use `http://` enquanto o HTTPS não estiver ativo. Depois troque para `https://`
> e reinicie o processo.

## 4. Instalar, preparar e compilar

```bash
cd /var/www/palavra-viva
sudo -u palavra npm ci
sudo -u palavra npm run db:setup
sudo -u palavra npm run build
```

O `db:setup` cria o SQLite, o conteúdo inicial e importa a Bíblia.
Se o build falhar por memória, crie swap:

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 5. PM2

```bash
npm install -g pm2
sudo -u palavra pm2 start npm --name palavra-viva -- start
sudo -u palavra pm2 save
sudo env PATH=$PATH pm2 startup systemd -u palavra --hp /home/palavra
```

Teste:

```bash
curl -I http://127.0.0.1:3000
```

Comandos úteis:

```bash
sudo -u palavra pm2 status
sudo -u palavra pm2 logs palavra-viva
sudo -u palavra pm2 restart palavra-viva
```

## 6. Nginx

Crie `/etc/nginx/sites-available/palavra-viva`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name seudominio.com.br www.seudominio.com.br;

    client_max_body_size 15M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

Ative:

```bash
ln -s /etc/nginx/sites-available/palavra-viva /etc/nginx/sites-enabled/palavra-viva
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 7. HTTPS

```bash
certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

Depois edite o `.env`:

```env
SITE_URL=https://seudominio.com.br
```

E reinicie:

```bash
sudo -u palavra pm2 restart palavra-viva
```

Renovação automática:

```bash
certbot renew --dry-run
```

## 8. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

A porta 3000 não deve ser exposta publicamente; o acesso passa pelo Nginx.

## 9. Permissões

O processo precisa escrever em `data/` e `public/uploads/` (se usados):

```bash
chown -R palavra:palavra /var/www/palavra-viva/data
chown -R palavra:palavra /var/www/palavra-viva/public
```

## 10. Backup

```bash
mkdir -p /var/backups/palavra-viva
sqlite3 /var/www/palavra-viva/data/app.db ".backup '/var/backups/palavra-viva/app-$(date +%F-%H%M).db'"
tar -czf "/var/backups/palavra-viva/uploads-$(date +%F-%H%M).tar.gz" -C /var/www/palavra-viva/data uploads
cp /var/www/palavra-viva/.env "/var/backups/palavra-viva/env-$(date +%F-%H%M).bak"
```

Cron diário às 3h:

```cron
0 3 * * * mkdir -p /var/backups/palavra-viva && sqlite3 /var/www/palavra-viva/data/app.db ".backup '/var/backups/palavra-viva/app-$(date +\%F-\%H\%M).db'" && tar -czf "/var/backups/palavra-viva/uploads-$(date +\%F-\%H\%M).tar.gz" -C /var/www/palavra-viva/data uploads && find /var/backups/palavra-viva -type f -mtime +14 -delete
```

Guarde uma cópia fora da VPS.

## 11. Atualizações

1. Faça backup.
2. Envie o novo código sem sobrescrever `data/` e `.env`.
3. No servidor:

```bash
cd /var/www/palavra-viva
sudo -u palavra npm ci
sudo -u palavra npm run build
sudo -u palavra pm2 restart palavra-viva
```

## 12. Checklist

- [ ] Site abre no domínio.
- [ ] Login em `/admin` funciona.
- [ ] Artigo, Bíblia, biblioteca e busca abrem.
- [ ] Uploads persistem após reiniciar o PM2.
- [ ] `SITE_URL` está com HTTPS.
- [ ] Certbot renova.
- [ ] Backup diário configurado.
