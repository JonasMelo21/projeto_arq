-- CreateEnum
CREATE TYPE "StatusVeiculo" AS ENUM ('DISPONIVEL', 'ALUGADO', 'EM_NEGOCIACAO_VENDA', 'VENDIDO', 'MANUTENCAO');

-- CreateTable
CREATE TABLE "veiculos" (
    "idString" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "chassi" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "combustivel" TEXT NOT NULL,
    "tipoCambio" TEXT NOT NULL,
    "anoFabricacao" INTEGER NOT NULL,
    "quilometragem" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "StatusVeiculo" NOT NULL DEFAULT 'DISPONIVEL',
    "acessorios" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("idString")
);

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_placa_key" ON "veiculos"("placa");
