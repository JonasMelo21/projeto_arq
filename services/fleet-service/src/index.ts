import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Listar todos os veículos
app.get('/veiculos', async (req, res) => {
  const veiculos = await prisma.veiculo.findMany();
  res.json(veiculos);
});

// Criar Veículo (Com suporte a JSONB para acessórios)
app.post('/veiculos', async (req, res) => {
  try {
    const { placa, marca, modelo, chassi, cor, combustivel, tipoCambio, anoFabricacao, acessorios } = req.body;
    
    const veiculo = await prisma.veiculo.create({
      data: {
        placa, marca, modelo, chassi, cor, combustivel, tipoCambio,
        anoFabricacao: Number(anoFabricacao),
        // Se vier null/undefined, salva array vazio
        acessorios: acessorios || [] 
      }
    });
    res.status(201).json(veiculo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar veículo. Placa já existe?' });
  }
});

app.listen(port, () => {
  console.log(`🚗 Fleet Service rodando na porta ${port}`);
});