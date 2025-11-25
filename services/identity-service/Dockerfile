FROM node:18-alpine

# INSTALAÇÃO MANUAL DE DEPENDÊNCIAS DO SISTEMA
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Gera o Prisma Client durante o build
RUN npx prisma generate

EXPOSE 3000

# Inicia garantindo a geração novamente
CMD ["sh", "-c", "npx prisma generate && npm run dev"]