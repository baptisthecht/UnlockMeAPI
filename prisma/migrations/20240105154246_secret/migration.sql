-- AlterTable
ALTER TABLE `User` ADD COLUMN `secret` VARCHAR(191) NULL,
    ADD COLUMN `temp_secret` VARCHAR(191) NULL;
