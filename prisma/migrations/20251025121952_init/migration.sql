-- CreateTable
CREATE TABLE "adotantes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adotantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT,
    "tamanho" TEXT,
    "personalidade" JSONB,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fotoUrl" TEXT,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adocoes" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "adotanteId" INTEGER NOT NULL,
    "dataAdocao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adocoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adotantes_email_key" ON "adotantes"("email");

-- CreateIndex
CREATE INDEX "idx_adotanteId" ON "adocoes"("adotanteId");

-- CreateIndex
CREATE UNIQUE INDEX "adocoes_petId_adotanteId_key" ON "adocoes"("petId", "adotanteId");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_petId_usuarioId_key" ON "favoritos"("petId", "usuarioId");

-- AddForeignKey
ALTER TABLE "adocoes" ADD CONSTRAINT "adocoes_adotanteId_fkey" FOREIGN KEY ("adotanteId") REFERENCES "adotantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adocoes" ADD CONSTRAINT "adocoes_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "adotantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
