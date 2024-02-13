/*
  Warnings:

  - You are about to drop the column `Description` on the `expense_categories` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `income_sources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `expense_categories` DROP COLUMN `Description`,
    ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `income_sources` DROP COLUMN `Description`,
    ADD COLUMN `description` VARCHAR(191) NULL;
