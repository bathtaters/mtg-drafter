/*
  Warnings:

  - You are about to drop the column `noGath` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `GameCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "noGath";
ALTER TABLE "Card" ADD COLUMN     "img" STRING;

-- AlterTable
ALTER TABLE "GameCard" DROP COLUMN "img";
