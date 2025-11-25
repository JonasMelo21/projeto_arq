FROM node:18-alpine

# INSTALAÇÃO MANUAL DE DEPENDÊNCIAS DO SISTEMA (A Correção)
# Instala OpenSSL e bibliotecas de compatibilidade C
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./

# Instala dependências do Node
RUN npm install

COPY . .

# Garante que o Prisma gere o cliente para o Linux Alpine durante o build
RUN npx prisma generate

EXPOSE 3000

# Script de inicialização que força a geração novamente ao subir (segurança dupla)
CMD ["sh", "-c", "npx prisma generate && npm run dev"]