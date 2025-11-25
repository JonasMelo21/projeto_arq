import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/locacoes', async (req, res) => {
  const locacoes = await prisma.locacao.findMany();
  res.json(locacoes);
});

app.post('/locacoes', async (req, res) => {
  try {
    const { clienteId, veiculoId, dataInicio, dataFimPrevisto, kmInicial, formaPagamento } = req.body;

    const locacao = await prisma.locacao.create({
      data: {
        clienteId, // ID vindo do Identity Service
        veiculoId, // ID vindo do Fleet Service
        dataInicio: new Date(dataInicio),
        dataFimPrevisto: new Date(dataFimPrevisto),
        kmInicial: Number(kmInicial),
        formaPagamento
      }
    });
    res.status(201).json(locacao);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar locação.' });
  }
});

app.listen(port, () => {
  console.log(`📝 Rental Service rodando na porta ${port}`);
});