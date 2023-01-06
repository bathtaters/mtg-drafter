/*
  Warnings:

  - You are about to drop the column `idx` on the `BoosterLayout` table. All the data in the column will be lost.
  - You are about to drop the column `packId` on the `GameCard` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Pack` table. All the data in the column will be lost.
  - Added the required column `index` to the `BoosterLayout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `GameCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packIdx` to the `GameCard` table without a default value. This is not possible if the table is not empty.

*/

-- Rename "idx" column --

-- Add Column
ALTER TABLE "BoosterLayout" ADD COLUMN     "index" INT4;
UPDATE "BoosterLayout" SET "index" = "idx";
ALTER TABLE "BoosterLayout" ALTER COLUMN   "index" SET NOT NULL;

-- AlterPrimaryKey
ALTER TABLE "BoosterLayout" ALTER PRIMARY KEY USING COLUMNS ("setCode", "index");

-- DropForeignKey
ALTER TABLE "SheetsInLayout" DROP CONSTRAINT "SheetsInLayout_setCode_layoutIdx_fkey";

-- AddForeignKey
ALTER TABLE "SheetsInLayout" ADD CONSTRAINT "SheetsInLayout_setCode_layoutIdx_fkey" FOREIGN KEY ("setCode", "layoutIdx") REFERENCES "BoosterLayout"("setCode", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "BoosterLayout" DROP COLUMN "idx";

-- Finish rename --


-- DropForeignKey
ALTER TABLE "GameCard" DROP CONSTRAINT "GameCard_packId_fkey";

-- DropIndex
DROP INDEX "Player_gameId_sessionId_idx";

-- AlterTable
ALTER TABLE "BoosterCard" ALTER COLUMN "weight" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "BoosterLayout" ALTER COLUMN "weight" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "BoosterSheet" ALTER COLUMN "foil" SET DEFAULT false;
ALTER TABLE "BoosterSheet" ALTER COLUMN "balanceColors" SET DEFAULT false;
ALTER TABLE "BoosterSheet" ALTER COLUMN "totalWeight" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "CardSet" ALTER COLUMN "totalWeight" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "GameCard" DROP COLUMN "packId";
ALTER TABLE "GameCard" ADD COLUMN     "foil" BOOL NOT NULL DEFAULT false;
ALTER TABLE "GameCard" ADD COLUMN     "gameId" STRING NOT NULL;
ALTER TABLE "GameCard" ADD COLUMN     "packIdx" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "SheetsInLayout" ALTER COLUMN "selectCount" SET DEFAULT 1;

-- RedefineTables
CREATE TABLE "_prisma_new_Pack" (
    "gameId" STRING NOT NULL,
    "index" INT4 NOT NULL,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("gameId","index")
);
DROP INDEX "Pack_gameId_index_key";
INSERT INTO "_prisma_new_Pack" ("gameId","index") SELECT "gameId","index" FROM "Pack";
DROP TABLE "Pack" CASCADE;
ALTER TABLE "_prisma_new_Pack" RENAME TO "Pack";
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Player_gameId_idx" ON "Player"("gameId");

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_gameId_packIdx_fkey" FOREIGN KEY ("gameId", "packIdx") REFERENCES "Pack"("gameId", "index") ON DELETE CASCADE ON UPDATE CASCADE;
