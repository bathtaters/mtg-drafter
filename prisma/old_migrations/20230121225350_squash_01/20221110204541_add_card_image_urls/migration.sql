/*
  Warnings:

  - You are about to drop the column `imgSrc` on the `GameCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameCard" DROP COLUMN "imgSrc";
ALTER TABLE "GameCard" ADD COLUMN     "img" STRING[];
