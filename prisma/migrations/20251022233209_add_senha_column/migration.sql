-- Add the senha column with a default value
ALTER TABLE `adotantes` ADD COLUMN `senha` VARCHAR(191) NOT NULL DEFAULT 'senha-temporaria';
