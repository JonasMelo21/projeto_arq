-- CreateTable
CREATE TABLE "pessoas" (
    "idString" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("idString")
);

-- CreateTable
CREATE TABLE "pessoas_fisicas" (
    "idString" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "cnh" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "pessoas_fisicas_pkey" PRIMARY KEY ("idString")
);

-- CreateTable
CREATE TABLE "pessoas_juridicas" (
    "idString" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "pessoas_juridicas_pkey" PRIMARY KEY ("idString")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "idString" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("idString")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_email_key" ON "pessoas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_fisicas_cpf_key" ON "pessoas_fisicas"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_fisicas_pessoaId_key" ON "pessoas_fisicas"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_juridicas_cnpj_key" ON "pessoas_juridicas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_juridicas_pessoaId_key" ON "pessoas_juridicas"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_matricula_key" ON "funcionarios"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_pessoaId_key" ON "funcionarios"("pessoaId");

-- AddForeignKey
ALTER TABLE "pessoas_fisicas" ADD CONSTRAINT "pessoas_fisicas_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("idString") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_juridicas" ADD CONSTRAINT "pessoas_juridicas_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("idString") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("idString") ON DELETE RESTRICT ON UPDATE CASCADE;
