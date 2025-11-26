/*
  Warnings:

  - You are about to drop the column `dataFimReal` on the `locacoes` table. All the data in the column will be lost.
  - Changed the type of `formaPagamento` on the `locacoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "locacoes" DROP COLUMN "dataFimReal",
ADD COLUMN     "dataEntrega" TIMESTAMP(3),
DROP COLUMN "formaPagamento",
ADD COLUMN     "formaPagamento" TEXT NOT NULL;

-- DropEnum
DROP TYPE "FormaPagamento";
