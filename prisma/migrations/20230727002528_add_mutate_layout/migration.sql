/*
  Warnings:

  - Added the required column `CardLayout` to the `Enums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CardLayout" ADD VALUE 'mutate';

-- AlterTable
ALTER TABLE "Enums" ADD COLUMN     "CardLayout" "CardLayout" NOT NULL;
