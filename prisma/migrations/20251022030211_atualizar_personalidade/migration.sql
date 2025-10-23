/*
  Warnings:

  - You are about to alter the column `personalidade` on the `pets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `pets` ADD COLUMN `fotoUrl` VARCHAR(191) NULL,
    MODIFY `personalidade` JSON NULL;
