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

// Buscar um único veículo pelo ID
app.get('/veiculos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const veiculo = await prisma.veiculo.findUnique({
      where: { idString: id }
    });
    if (!veiculo) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.json(veiculo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar veículo' });
  }
});

// Criar Veículo
app.post('/veiculos', async (req, res) => {
  try {
    const { placa, marca, modelo, chassi, cor, combustivel, tipoCambio, anoFabricacao, acessorios } = req.body;
    
    const veiculo = await prisma.veiculo.create({
      data: {
        placa, marca, modelo, chassi, cor, combustivel, tipoCambio,
        anoFabricacao: Number(anoFabricacao),
        acessorios: acessorios || [] 
      }
    });
    res.status(201).json(veiculo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar veículo. Placa já existe?' });
  }
});

// --- ROTA DE ATUALIZAÇÃO (Melhorada para aceitar Ano) ---
app.patch('/veiculos/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, kmAtual, anoFabricacao } = req.body; // Agora aceita anoFabricacao

  try {
    const data: any = {};
    
    if (status) data.status = status;
    if (kmAtual !== undefined) data.quilometragem = Number(kmAtual);
    if (anoFabricacao !== undefined) data.anoFabricacao = Number(anoFabricacao); // Lógica nova

    const veiculo = await prisma.veiculo.update({
      where: { idString: id },
      data: data
    });
    res.json(veiculo);
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error);
    res.status(400).json({ error: 'Erro ao atualizar dados do veículo' });
  }
});

app.listen(port, () => {
  console.log(`🚗 Fleet Service rodando na porta ${port}`);
});