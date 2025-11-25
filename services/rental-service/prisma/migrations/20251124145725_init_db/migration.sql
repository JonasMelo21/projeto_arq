-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('CREDITO', 'DEBITO', 'DINHEIRO', 'PIX');

-- CreateTable
CREATE TABLE "locacoes" (
    "idString" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFimPrevisto" TIMESTAMP(3) NOT NULL,
    "dataFimReal" TIMESTAMP(3),
    "kmInicial" DOUBLE PRECISION NOT NULL,
    "kmFinal" DOUBLE PRECISION,
    "valorTotal" DOUBLE PRECISION,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "clienteId" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locacoes_pkey" PRIMARY KEY ("idString")
);
