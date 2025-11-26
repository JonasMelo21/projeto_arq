import express from 'express';
import cors from 'cors';
import axios from 'axios'; 
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// DEFINIÇÃO DA URL DO FLEET SERVICE
const FLEET_API = process.env.FLEET_API_URL || 'http://fleet-service:3002';

app.get('/locacoes', async (req, res) => {
  const locacoes = await prisma.locacao.findMany({
    orderBy: { dataInicio: 'desc' }
  });
  res.json(locacoes);
});

// 1. CRIAR LOCAÇÃO
app.post('/locacoes', async (req, res) => {
  try {
    const { clienteId, veiculoId, dataInicio, dataFimPrevisto, kmInicial, formaPagamento } = req.body;

    // Regra de Ouro: Bloqueia se já tiver aluguel ativo
    const locacaoAtiva = await prisma.locacao.findFirst({
      where: {
        clienteId: clienteId,
        dataEntrega: null 
      }
    });

    if (locacaoAtiva) {
      return res.status(409).json({ 
        error: 'REGRA VIOLADA: Cliente já possui uma locação ativa. Devolva o veículo anterior primeiro.' 
      });
    }

    // Cria a locação
    const locacao = await prisma.locacao.create({
      data: {
        clienteId,
        veiculoId,
        dataInicio: new Date(dataInicio),
        dataFimPrevisto: new Date(dataFimPrevisto),
        kmInicial: Number(kmInicial),
        formaPagamento
      }
    });

    // Atualiza status do carro para ALUGADO
    try {
        await axios.patch(`${FLEET_API}/veiculos/${veiculoId}/status`, {
            status: 'ALUGADO'
        });
    } catch (err) {
        console.error("Erro ao comunicar com Fleet Service:", err);
    }

    res.status(201).json(locacao);

  } catch (error) {
    console.error("Erro no Rental Service:", error);
    res.status(400).json({ error: 'Erro ao processar locação.' });
  }
});

// 2. FINALIZAR LOCAÇÃO (DEVOLUÇÃO)
app.put('/locacoes/:id/finalizar', async (req, res) => {
  const { id } = req.params;
  const { kmFinal } = req.body;

  try {
    const locacao = await prisma.locacao.findUnique({ where: { idString: id } });

    if (!locacao) return res.status(404).json({ error: 'Locação não encontrada' });
    if (locacao.dataEntrega) return res.status(400).json({ error: 'Locação já finalizada' });

    const inicio = new Date(locacao.dataInicio);
    const fim = new Date();
    
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diasUso = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const valorTotal = diasUso * 100.00; 

    // Atualiza a Locação
    const locacaoAtualizada = await prisma.locacao.update({
      where: { idString: id },
      data: {
        dataEntrega: fim,
        kmFinal: Number(kmFinal),
        valorTotal: valorTotal
      }
    });

    // Atualiza status do carro para DISPONIVEL e atualiza KM
    try {
        // CORREÇÃO AQUI: Usando a variável correta FLEET_API
        await axios.patch(`${FLEET_API}/veiculos/${locacao.veiculoId}/status`, {
            status: 'DISPONIVEL',
            kmAtual: Number(kmFinal)
        });
    } catch (err) {
        console.error("Erro ao liberar veículo no Fleet Service:", err);
    }

    res.json(locacaoAtualizada);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao finalizar locação.' });
  }
});

app.listen(port, () => {
  console.log(`📝 Rental Service rodando na porta ${port}`);
});