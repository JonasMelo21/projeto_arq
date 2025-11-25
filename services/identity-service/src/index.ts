import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/pessoas', async (req, res) => {
  // Traz a pessoa e inclui os detalhes de PF ou PJ se existirem
  const pessoas = await prisma.pessoa.findMany({
    include: { pessoaFisica: true, pessoaJuridica: true }
  });
  res.json(pessoas);
});

// Criar Cliente Pessoa Física (PF)
app.post('/clientes/pf', async (req, res) => {
  try {
    const { nome, email, telefone, endereco, cpf, rg, cnh, sexo, dataNascimento } = req.body;

    const pessoa = await prisma.pessoa.create({
      data: {
        nome, email, telefone,
        logradouro: endereco.logradouro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
        // Criação Aninhada (Nested Write) do Prisma
        pessoaFisica: {
          create: {
            cpf, rg, cnh, sexo,
            dataNascimento: new Date(dataNascimento)
          }
        }
      },
      include: { pessoaFisica: true }
    });
    res.status(201).json(pessoa);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar PF. Email ou CPF já existem.' });
  }
});

app.listen(port, () => {
  console.log(`👤 Identity Service rodando na porta ${port}`);
});