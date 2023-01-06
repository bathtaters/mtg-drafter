/*
  Warnings:

  - !! You will be dropping all data in "BoosterLayout" table
  - You are about to drop the column `layoutId` on the `SheetsInLayout` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `BoosterLayout` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `BoosterCard` table. All the data in the column will be lost.
  - You are about to drop the column `sheetSet` on the `BoosterCard` table. All the data in the column will be lost.
  - Added the required column `layoutIdx` to the `SheetsInLayout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idx` to the `BoosterLayout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setCode` to the `BoosterCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SheetsInLayout" DROP CONSTRAINT "SheetsInLayout_setCode_layoutId_fkey";

-- AlterTable
ALTER TABLE "SheetsInLayout" ADD COLUMN     "layoutIdx" INT4 NOT NULL;

-- AlterPrimaryKey
ALTER TABLE "SheetsInLayout" ALTER PRIMARY KEY USING COLUMNS ("setCode", "layoutIdx", "sheetName");

-- AlterTable (Moved to avoid dropping Primary Key)
ALTER TABLE "SheetsInLayout" DROP COLUMN "layoutId";

-- RedefineTables
CREATE TABLE "_prisma_new_BoosterLayout" (
    "setCode" STRING NOT NULL,
    "idx" INT4 NOT NULL,
    "weight" INT4 NOT NULL,

    CONSTRAINT "BoosterLayout_pkey" PRIMARY KEY ("setCode","idx")
);
DROP INDEX IF EXISTS "BoosterLayout_setCode_id_key";
DROP INDEX IF EXISTS "BoosterLayout_setCode_idx";

-- Removed to avoid "Missing 'idx' primary key column"
-- INSERT INTO "_prisma_new_BoosterLayout" ("setCode","weight") SELECT "setCode","weight" FROM "BoosterLayout";

DROP TABLE "BoosterLayout" CASCADE;
ALTER TABLE "_prisma_new_BoosterLayout" RENAME TO "BoosterLayout";
ALTER TABLE "BoosterLayout" ADD CONSTRAINT "BoosterLayout_setCode_fkey" FOREIGN KEY ("setCode") REFERENCES "CardSet"("code") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_BoosterCard" (
    "sheetName" STRING NOT NULL,
    "cardId" STRING NOT NULL,
    "weight" INT4 NOT NULL,
    "setCode" STRING NOT NULL,

    CONSTRAINT "BoosterCard_pkey" PRIMARY KEY ("sheetName","cardId")
);
INSERT INTO "_prisma_new_BoosterCard" ("cardId","sheetName","weight") SELECT "cardId","sheetName","weight" FROM "BoosterCard";
DROP TABLE "BoosterCard" CASCADE;
ALTER TABLE "_prisma_new_BoosterCard" RENAME TO "BoosterCard";
ALTER TABLE "BoosterCard" ADD CONSTRAINT "BoosterCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "BoosterCard" ADD CONSTRAINT "BoosterCard_setCode_sheetName_fkey" FOREIGN KEY ("setCode", "sheetName") REFERENCES "BoosterSheet"("setCode", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetsInLayout" ADD CONSTRAINT "SheetsInLayout_setCode_layoutIdx_fkey" FOREIGN KEY ("setCode", "layoutIdx") REFERENCES "BoosterLayout"("setCode", "idx") ON DELETE CASCADE ON UPDATE CASCADE;
