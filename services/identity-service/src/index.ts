// services/identity-service/src/index.ts

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Rota de Listagem (Debug) ---
app.get('/pessoas', async (req, res) => {
  const pessoas = await prisma.pessoa.findMany({
    include: { pessoaFisica: true, pessoaJuridica: true, funcionario: true }
  });
  res.json(pessoas);
});

// --- Rota de Login ---
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca usuário pelo email
    const user = await prisma.pessoa.findUnique({
      where: { email },
      include: { pessoaFisica: true, pessoaJuridica: true, funcionario: true }
    });

    // Verificação simples (Em produção, use bcrypt para comparar hash)
    if (!user || user.senha !== senha) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Retorna dados do usuário (sem a senha)
    const { senha: _, ...userData } = user;
    res.json(userData);

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// --- Rota Cadastro Pessoa Física (PF) ---
app.post('/signup/pf', async (req, res) => {
  try {
    const { 
      nome, email, senha, telefone, 
      endereco, // Objeto { logradouro, cidade, estado, cep }
      cpf, rg, cnh, sexo, dataNascimento 
    } = req.body;

    const pessoa = await prisma.pessoa.create({
      data: {
        nome, 
        email, 
        senha, 
        telefone,
        role: 'CLIENTE', // Define papel padrão
        // Dados de Endereço (achatados na tabela Pessoa)
        logradouro: endereco.logradouro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
        
        // Criação Aninhada da Tabela Específica
        pessoaFisica: {
          create: {
            cpf, 
            rg, 
            cnh, 
            sexo,
            dataNascimento: new Date(dataNascimento)
          }
        }
      },
      include: { pessoaFisica: true } // Retorna os dados criados
    });

    // Remove senha do retorno
    const { senha: _, ...response } = pessoa;
    res.status(201).json(response);

  } catch (error) {
    console.error("Erro ao criar PF:", error);
    res.status(400).json({ error: 'Erro ao cadastrar. Email ou CPF já existem?' });
  }
});

// --- Rota Cadastro Pessoa Jurídica (PJ) ---
app.post('/signup/pj', async (req, res) => {
  try {
    const { 
      nomeFantasia, razaoSocial, cnpj, // Dados PJ
      email, senha, telefone, 
      endereco // Objeto { logradouro, cidade, estado, cep }
    } = req.body;

    // Para PJ, usamos o Nome Fantasia como o "nome" principal da Pessoa
    const pessoa = await prisma.pessoa.create({
      data: {
        nome: nomeFantasia, 
        email, 
        senha, 
        telefone,
        role: 'CLIENTE',
        
        logradouro: endereco.logradouro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
        
        pessoaJuridica: {
          create: {
            cnpj,
            razaoSocial,
            nomeFantasia
          }
        }
      },
      include: { pessoaJuridica: true }
    });

    const { senha: _, ...response } = pessoa;
    res.status(201).json(response);

  } catch (error) {
    console.error("Erro ao criar PJ:", error);
    res.status(400).json({ error: 'Erro ao cadastrar. CNPJ ou Email já existem?' });
  }
});

app.listen(port, () => {
  console.log(`👤 Identity Service rodando na porta ${port}`);
});