# Identity Service (Usuários)
cd services/identity-service && npx prisma migrate dev --name init_db

# Fleet Service (Carros)
cd ../fleet-service && npx prisma migrate dev --name init_db

# Rental Service (Locações)
cd ../rental-service && npx prisma migrate dev --name init_db

# Voltar para raiz
cd ../..