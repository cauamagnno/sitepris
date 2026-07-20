#!/bin/bash

# ============================================
#  Script de Deploy: index2.html → GitHub
# ============================================

GH_TOKEN="SEU_TOKEN_AQUI"
REPO_NAME="sitepris"
GH_USER=$(curl -s -H "Authorization: token $GH_TOKEN" https://api.github.com/user | python3 -c "import sys,json; print(json.load(sys.stdin)['login'])")

echo ""
echo "👤 Usuário GitHub: $GH_USER"
echo "📁 Repositório: $REPO_NAME"
echo ""

# 1. Criar repositório no GitHub
echo "🔧 Criando repositório no GitHub..."
CREATE_RESULT=$(curl -s -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"Site Pris\",\"private\":false,\"auto_init\":false}")

REPO_URL=$(echo $CREATE_RESULT | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('html_url',''))" 2>/dev/null)

if [ -z "$REPO_URL" ]; then
  echo "⚠️  Repositório pode já existir, continuando..."
  REPO_URL="https://github.com/$GH_USER/$REPO_NAME"
fi

echo "✅ Repositório: $REPO_URL"
echo ""

# 2. Criar pasta temporária e subir só o index2.html
echo "📦 Preparando arquivo para upload..."
TEMP_DIR=$(mktemp -d)
cp "$(dirname "$0")/index2.html" "$TEMP_DIR/"

cd "$TEMP_DIR"
git init
git config user.email "cauamagno42@gmail.com"
git config user.name "Cauã Magno"
git add index2.html
git commit -m "feat: add index2.html"

# 3. Push para o GitHub
echo "🚀 Subindo para o GitHub..."
git remote add origin "https://$GH_TOKEN@github.com/$GH_USER/$REPO_NAME.git"
git branch -M main
git push -u origin main

echo ""
echo "✅ Arquivo publicado com sucesso!"
echo "🔗 Repositório: $REPO_URL"
echo ""
echo "========================================"
echo " PRÓXIMO PASSO: Deploy no Vercel"
echo "========================================"
echo ""
echo "1. Acesse: https://vercel.com/new"
echo "2. Clique em 'Import Git Repository'"
echo "3. Selecione o repositório: $REPO_NAME"
echo "4. Clique em 'Deploy'"
echo ""
echo "Seu site estará online em ~1 minuto! 🎉"

# Limpar pasta temporária
cd /
rm -rf "$TEMP_DIR"
