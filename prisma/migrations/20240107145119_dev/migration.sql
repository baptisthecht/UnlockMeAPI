/*
  Warnings:

  - You are about to drop the column `gameName` on the `GameActivity` table. All the data in the column will be lost.
  - Added the required column `gameId` to the `GameActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameActivity` DROP COLUMN `gameName`,
    ADD COLUMN `gameId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Game_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameActivity` ADD CONSTRAINT `GameActivity_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
