#!/bin/bash

echo "⏳ Aguardando Fleet Service iniciar na porta 3002..."
sleep 5 # Dá um tempo pro container subir se você acabou de rodar o compose up

API_URL="http://localhost:3002/veiculos"

echo "🚀 Iniciando cadastro da frota..."

# --- CARROS NOVOS (Disponíveis) ---

# 1. Honda CR-V
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Honda",
    "modelo": "CR-V Touring",
    "placa": "HND-2023",
    "chassi": "9BW12345678901234",
    "cor": "Prata",
    "combustivel": "Gasolina",
    "tipoCambio": "Automatico",
    "anoFabricacao": 2023,
    "quilometragem": 15000,
    "acessorios": ["Ar Condicionado", "GPS", "Câmera de Ré"]
  }' > /dev/null
echo "✅ Honda CR-V Cadastrado"

# 2. Ford Transit
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Ford",
    "modelo": "Transit Minibus",
    "placa": "FRD-9988",
    "chassi": "9BF12345678901234",
    "cor": "Branco",
    "combustivel": "Diesel",
    "tipoCambio": "Manual",
    "anoFabricacao": 2022,
    "quilometragem": 45000,
    "acessorios": ["16 Lugares", "Direção Hidráulica"]
  }' > /dev/null
echo "✅ Ford Transit Cadastrado"

# 3. Tesla Model 3
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Tesla",
    "modelo": "Model 3 Performance",
    "placa": "ELK-2050",
    "chassi": "5YJ12345678901234",
    "cor": "Vermelho",
    "combustivel": "Eletrico",
    "tipoCambio": "Automatico",
    "anoFabricacao": 2024,
    "quilometragem": 5000,
    "acessorios": ["Autopilot", "Teto Solar", "Couro"]
  }' > /dev/null
echo "✅ Tesla Model 3 Cadastrado"

# 4. Chevrolet Spark
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Chevrolet",
    "modelo": "Spark GT",
    "placa": "CHV-1010",
    "chassi": "9BG12345678901234",
    "cor": "Azul",
    "combustivel": "Flex",
    "tipoCambio": "Manual",
    "anoFabricacao": 2021,
    "quilometragem": 60000,
    "acessorios": ["Som Bluetooth", "Vidro Elétrico"]
  }' > /dev/null
echo "✅ Chevrolet Spark Cadastrado"

# 5. BMW 5 Series
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "BMW",
    "modelo": "5 Series Sedan",
    "placa": "BMW-5000",
    "chassi": "WBA12345678901234",
    "cor": "Preto",
    "combustivel": "Gasolina",
    "tipoCambio": "Automatico",
    "anoFabricacao": 2023,
    "quilometragem": 12000,
    "acessorios": ["Bancos de Couro", "Sensores 360", "Turbo"]
  }' > /dev/null
echo "✅ BMW 5 Series Cadastrado"

# 6. Jeep Wrangler
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Jeep",
    "modelo": "Wrangler Sahara",
    "placa": "JEP-4X44",
    "chassi": "1C412345678901234",
    "cor": "Verde",
    "combustivel": "Diesel",
    "tipoCambio": "Automatico",
    "anoFabricacao": 2022,
    "quilometragem": 30000,
    "acessorios": ["4x4", "Capota Removível", "Guincho"]
  }' > /dev/null
echo "✅ Jeep Wrangler Cadastrado"

# 7. Hyundai Elantra
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Hyundai",
    "modelo": "Elantra GLS",
    "placa": "HYU-3030",
    "chassi": "KMH12345678901234",
    "cor": "Branco",
    "combustivel": "Flex",
    "tipoCambio": "Automatico",
    "anoFabricacao": 2021,
    "quilometragem": 55000,
    "acessorios": ["Multimídia", "Sensor de Ré"]
  }' > /dev/null
echo "✅ Hyundai Elantra Cadastrado"

# 8. Toyota Corolla
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Toyota",
    "modelo": "Corolla XEi",
    "placa": "TYT-2020",
    "chassi": "9BR12345678901234",
    "cor": "Prata",
    "combustivel": "Flex",
    "tipoCambio": "Automatico",
    "anoFabricacao": 2023,
    "quilometragem": 20000,
    "acessorios": ["Ar Digital", "Couro", "Paddle Shift"]
  }' > /dev/null
echo "✅ Toyota Corolla Cadastrado"

# --- CARRO VELHO (Para Teste de Regra de Negócio) ---

echo "⚠️ Inserindo veículo de teste para regra de bloqueio (>4 anos)..."
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Fiat",
    "modelo": "Uno Way 1.4",
    "placa": "OLD-2013",
    "chassi": "9BD12345678901234",
    "cor": "Vermelho",
    "combustivel": "Flex",
    "tipoCambio": "Manual",
    "anoFabricacao": 2013,
    "quilometragem": 120000,
    "acessorios": ["Vidro Elétrico", "Ar Quente"]
  }' > /dev/null
echo "✅ Fiat Uno 2013 (Bloqueado) Cadastrado"

echo "🎉 Banco de dados populado com sucesso!"