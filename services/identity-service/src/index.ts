import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de Listagem (Debug)
app.get('/pessoas', async (req, res) => {
  const pessoas = await prisma.pessoa.findMany({
    include: { pessoaFisica: true, pessoaJuridica: true, funcionario: true }
  });
  res.json(pessoas);
});

// Rota de Login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await prisma.pessoa.findUnique({
      where: { email },
      include: { pessoaFisica: true, pessoaJuridica: true, funcionario: true }
    });

    if (!user || user.senha !== senha) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const { senha: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Cadastro PF
app.post('/signup/pf', async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco, cpf, rg, cnh, sexo, dataNascimento } = req.body;
    const pessoa = await prisma.pessoa.create({
      data: {
        nome, email, senha, telefone, role: 'CLIENTE',
        logradouro: endereco.logradouro, cidade: endereco.cidade, estado: endereco.estado, cep: endereco.cep,
        pessoaFisica: {
          create: { cpf, rg, cnh, sexo, dataNascimento: new Date(dataNascimento) }
        }
      },
      include: { pessoaFisica: true }
    });
    const { senha: _, ...response } = pessoa;
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar PF' });
  }
});

// Cadastro PJ
app.post('/signup/pj', async (req, res) => {
  try {
    const { nomeFantasia, razaoSocial, cnpj, email, senha, telefone, endereco } = req.body;
    const pessoa = await prisma.pessoa.create({
      data: {
        nome: nomeFantasia, email, senha, telefone, role: 'CLIENTE',
        logradouro: endereco.logradouro, cidade: endereco.cidade, estado: endereco.estado, cep: endereco.cep,
        pessoaJuridica: {
          create: { cnpj, razaoSocial, nomeFantasia }
        }
      },
      include: { pessoaJuridica: true }
    });
    const { senha: _, ...response } = pessoa;
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar PJ' });
  }
});

// --- NOVA ROTA: Cadastro de Funcionário (ADMIN) ---
app.post('/signup/funcionario', async (req, res) => {
  try {
    const { 
      nome, email, senha, telefone, matricula, // Dados básicos
      endereco, // Objeto { logradouro, cidade, estado, cep }
      cpf, rg, sexo, dataNascimento // Dados pessoais obrigatórios p/ funcionário (PDF)
    } = req.body;

    const pessoa = await prisma.pessoa.create({
      data: {
        nome, email, senha, telefone,
        role: 'ADMIN', // Define como ADMIN
        logradouro: endereco.logradouro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
        
        // Funcionário tem dados de Pessoa Física (CPF/RG) E dados de Funcionário (Matrícula)
        pessoaFisica: {
            create: { cpf, rg, cnh: 'N/A', sexo, dataNascimento: new Date(dataNascimento) }
        },
        funcionario: {
            create: { matricula }
        }
      },
      include: { funcionario: true, pessoaFisica: true }
    });

    const { senha: _, ...response } = pessoa;
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao cadastrar Funcionário. Matrícula ou CPF já existem?' });
  }
});

app.listen(port, () => {
  console.log(`👤 Identity Service rodando na porta ${port}`);
});