/*
  Warnings:

  - !! All data in BoosterCard will be deleted
  - The required column `id` was added to the `BoosterCard` table with a prisma-level default value. This is not possible if the table is not empty.

*/
-- Clear table
DELETE FROM "BoosterCard";

-- AlterTable
ALTER TABLE "BoosterCard" ADD COLUMN     "id" STRING NOT NULL;

-- AlterPrimaryKey
ALTER TABLE "BoosterCard" ALTER PRIMARY KEY USING COLUMNS ("id");

-- CreateIndex
CREATE INDEX "BoosterCard_setCode_sheetName_idx" ON "BoosterCard"("setCode", "sheetName");

-- DropIndex
DROP INDEX "BoosterCard_sheetName_cardId_key" CASCADE;