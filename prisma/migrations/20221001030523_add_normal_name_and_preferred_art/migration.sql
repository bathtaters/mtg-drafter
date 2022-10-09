/*
  Warnings:

  - You are about to drop the column `skipArt` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "skipArt";
ALTER TABLE "Card" ADD COLUMN     "normalName" STRING;
ALTER TABLE "Card" ADD COLUMN     "preferredArt" BOOL NOT NULL DEFAULT false;
