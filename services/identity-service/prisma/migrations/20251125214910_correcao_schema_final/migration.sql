/*
  Warnings:

  - Added the required column `senha` to the `pessoas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `pessoas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FUNCIONARIO', 'CLIENTE');

-- DropForeignKey
ALTER TABLE "funcionarios" DROP CONSTRAINT "funcionarios_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "pessoas_fisicas" DROP CONSTRAINT "pessoas_fisicas_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "pessoas_juridicas" DROP CONSTRAINT "pessoas_juridicas_pessoaId_fkey";

-- AlterTable
ALTER TABLE "pessoas" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENTE',
ADD COLUMN     "senha" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "pessoas_fisicas" ADD CONSTRAINT "pessoas_fisicas_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("idString") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_juridicas" ADD CONSTRAINT "pessoas_juridicas_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("idString") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("idString") ON DELETE CASCADE ON UPDATE CASCADE;
