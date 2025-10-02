-- CreateTable
CREATE TABLE `adotantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `adotantes_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `especie` VARCHAR(191) NOT NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `tamanho` VARCHAR(191) NULL,
    `personalidade` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'disponivel',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adocoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `petId` INTEGER NOT NULL,
    `adotanteId` INTEGER NOT NULL,
    `dataAdocao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `adocoes_petId_adotanteId_key`(`petId`, `adotanteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `adocoes` ADD CONSTRAINT `adocoes_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adocoes` ADD CONSTRAINT `adocoes_adotanteId_fkey` FOREIGN KEY (`adotanteId`) REFERENCES `adotantes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
