/*
  Warnings:

  - Added the required column `title` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `incomes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expenses` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `incomes` ADD COLUMN `title` VARCHAR(191) NOT NULL;
