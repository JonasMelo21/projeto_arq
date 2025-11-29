#!/bin/bash

# Para o script se der erro em algum comando
set -e

echo "🛑 Derrubando containers antigos..."
docker-compose down -v

echo "🏗️  Construindo e iniciando containers..."
docker-compose up --build -d

echo "⏳ Aguardando serviços subirem (1s)..."
# Dá um tempo extra para o Postgres e as APIs estarem 100%
sleep 120

echo "🌱 Populando o banco de dados..."
# Garante que o seed_db.sh tenha permissão de execução
chmod +x seed_db.sh
./seed_db.sh

echo "✅ Sistema pronto! Acesse http://localhost:3000"