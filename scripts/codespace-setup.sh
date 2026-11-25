#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

site_url="http://localhost:3000"
if [ -n "${CODESPACE_NAME:-}" ] && [ -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]; then
  site_url="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
fi

if [ ! -f .env ]; then
  admin_password="pv-$(openssl rand -hex 6)"
  session_secret="$(openssl rand -hex 32)"

  cat > .env <<EOF
ADMIN_EMAIL=admin@palavraviva.local
ADMIN_PASSWORD=${admin_password}
ADMIN_NAME=Administrador
SESSION_SECRET=${session_secret}
SITE_URL=${site_url}
EOF

  cat > CREDENCIAIS-CODESPACE.txt <<EOF
Palavra Viva — credenciais do Codespace
E-mail: admin@palavraviva.local
Senha: ${admin_password}
URL: ${site_url}
EOF
else
  # Mantém a URL do Codespace atualizada quando o ambiente for recriado.
  if [ -n "${CODESPACE_NAME:-}" ] && [ -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]; then
    if grep -q '^SITE_URL=' .env; then
      sed -i "s|^SITE_URL=.*|SITE_URL=${site_url}|" .env
    else
      printf '\nSITE_URL=%s\n' "${site_url}" >> .env
    fi
  fi
fi

echo "Instalando dependências..."
npm ci

echo "Preparando banco e importando a Bíblia..."
npm run db:setup

echo ""
echo "Tudo pronto."
echo "Credenciais: CREDENCIAIS-CODESPACE.txt"
echo "O servidor inicia automaticamente na porta 3000."
