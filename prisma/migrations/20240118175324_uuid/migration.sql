/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Photo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Photo_uuid_key` ON `Photo`(`uuid`);
