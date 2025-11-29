# --- 1. CRIAR O ADMIN (IDENTITY SERVICE) ---
echo "👑 Criando Admin..."
curl -X POST http://localhost:3001/signup/funcionario \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Admin Supremo",
    "email": "admin@frotas.com",
    "senha": "admin123",
    "telefone": "11999999999",
    "matricula": "ADM001",
    "cpf": "000.000.000-00",
    "rg": "0.000.000",
    "sexo": "M",
    "dataNascimento": "1990-01-01",
    "endereco": { "logradouro": "HQ", "cidade": "SP", "estado": "SP", "cep": "00000-000" }
  }'
echo -e "\n"

# --- 2. INSERIR FROTA PREMIUM (NOVOS E BAIXO KM) ---
echo "🚗 Inserindo Frota Premium (Todos Disponíveis)..."

# Tesla Model 3 (Já era novo, mantido)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Tesla", "modelo": "Model 3", "placa": "ELE-2025", "cor": "Branco",
    "chassi": "9BW123TESLA001", 
    "anoFabricacao": 2024, "combustivel": "ELETRICO", "tipoCambio": "AUTOMATICO",
    "quilometragem": 1500, "status": "DISPONIVEL",
    "acessorios": ["Autopilot", "GPS", "Teto Solar", "Couro"]
}'

# BMW Serie 5 (Atualizado KM)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "BMW", "modelo": "5 Series", "placa": "BMW-5555", "cor": "Preto",
    "chassi": "9BW123BMW002",
    "anoFabricacao": 2023, "combustivel": "GASOLINA", "tipoCambio": "AUTOMATICO",
    "quilometragem": 3200, "status": "DISPONIVEL",
    "acessorios": ["Turbo", "Couro", "GPS", "Sensores"]
}'

# Toyota Corolla (Atualizado KM)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Toyota", "modelo": "Corolla XEi", "placa": "COR-2023", "cor": "Prata",
    "chassi": "9BW123TOYOTA003",
    "anoFabricacao": 2023, "combustivel": "FLEX", "tipoCambio": "AUTOMATICO",
    "quilometragem": 2800, "status": "DISPONIVEL",
    "acessorios": ["Ar Condicionado", "Câmera de Ré", "Multimídia"]
}'

# Honda CR-V (Atualizado Ano e KM)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Honda", "modelo": "CR-V Touring", "placa": "HON-1010", "cor": "Cinza",
    "chassi": "9BW123HONDA004",
    "anoFabricacao": 2023, "combustivel": "GASOLINA", "tipoCambio": "AUTOMATICO",
    "quilometragem": 1500, "status": "DISPONIVEL",
    "acessorios": ["4x4", "Teto Solar", "Couro", "GPS"]
}'

# Jeep Wrangler (Atualizado de 2021 para 2024)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Jeep", "modelo": "Wrangler", "placa": "TRL-4444", "cor": "Verde",
    "chassi": "9BW123JEEP005",
    "anoFabricacao": 2024, "combustivel": "DIESEL", "tipoCambio": "AUTOMATICO",
    "quilometragem": 500, "status": "DISPONIVEL",
    "acessorios": ["4x4", "Guincho", "Snorkel", "GPS"]
}'

# Fiat Uno (Atualizado para "Última Edição" 2022 - Relíquia Zero KM)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Fiat", "modelo": "Uno Mille", "placa": "ESC-1234", "cor": "Branco",
    "chassi": "9BW123FIAT006",
    "anoFabricacao": 2022, "combustivel": "FLEX", "tipoCambio": "MANUAL",
    "quilometragem": 3900, "status": "DISPONIVEL",
    "acessorios": ["Escada no Teto", "Ar Condicionado"]
}'

# Ford Transit (Tirado da Manutenção e baixado KM)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Ford", "modelo": "Transit", "placa": "VAN-9090", "cor": "Branca",
    "chassi": "9BW123FORD007",
    "anoFabricacao": 2023, "combustivel": "DIESEL", "tipoCambio": "MANUAL",
    "quilometragem": 1200, "status": "DISPONIVEL",
    "acessorios": ["8 Lugares", "GPS", "Bagageiro"]
}'

# Hyundai Elantra (Atualizado de 2018 para 2023)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Hyundai", "modelo": "Elantra", "placa": "HYU-2020", "cor": "Preto",
    "chassi": "9BW123HYUNDAI008",
    "anoFabricacao": 2023, "combustivel": "GASOLINA", "tipoCambio": "AUTOMATICO",
    "quilometragem": 3500, "status": "DISPONIVEL",
    "acessorios": ["Couro", "Teto Solar"]
}'

# Chevrolet Spark (Atualizado de 2019 para 2024)
curl -X POST http://localhost:3002/veiculos -H "Content-Type: application/json" -d '{
    "marca": "Chevrolet", "modelo": "Spark", "placa": "PEQ-1111", "cor": "Vermelho",
    "chassi": "9BW123CHEVY009",
    "anoFabricacao": 2024, "combustivel": "GASOLINA", "tipoCambio": "MANUAL",
    "quilometragem": 200, "status": "DISPONIVEL",
    "acessorios": ["Ar Condicionado", "Direção Hidráulica"]
}'

echo -e "\n✅ Banco restaurado! Todos os carros estão novos e disponíveis para o teste."