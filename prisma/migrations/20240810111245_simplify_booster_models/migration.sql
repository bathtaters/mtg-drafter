/*
  Warnings:

  - You are about to drop the column `boosterType` on the `CardSet` table. All the data in the column will be lost.
  - You are about to drop the column `totalWeight` on the `CardSet` table. All the data in the column will be lost.
  - You are about to drop the `BoosterCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoosterLayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoosterSheet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SheetsInLayout` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE "Booster" (
    "setCode"      STRING NOT NULL,
    "boosterType"  STRING NOT NULL,
    "data"         JSONB NOT NULL,

    CONSTRAINT "Booster_pkey" PRIMARY KEY ("setCode","boosterType")
);

-- AddForeignKey
ALTER TABLE "Booster" ADD CONSTRAINT "Booster_setCode_fkey" FOREIGN KEY ("setCode") REFERENCES "CardSet"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "CardSet" DROP COLUMN "boosterType";
ALTER TABLE "CardSet" DROP COLUMN "totalWeight";

-- DropForeignKey
ALTER TABLE "BoosterCard" DROP CONSTRAINT "BoosterCard_cardId_fkey";

-- DropForeignKey
ALTER TABLE "BoosterCard" DROP CONSTRAINT "BoosterCard_setCode_sheetName_fkey";

-- DropForeignKey
ALTER TABLE "BoosterLayout" DROP CONSTRAINT "BoosterLayout_setCode_fkey";

-- DropForeignKey
ALTER TABLE "BoosterSheet" DROP CONSTRAINT "BoosterSheet_setCode_fkey";

-- DropForeignKey
ALTER TABLE "SheetsInLayout" DROP CONSTRAINT "SheetsInLayout_setCode_layoutIdx_fkey";

-- DropForeignKey
ALTER TABLE "SheetsInLayout" DROP CONSTRAINT "SheetsInLayout_setCode_sheetName_fkey";

-- DropTable
DROP TABLE "BoosterCard";

-- DropTable
DROP TABLE "BoosterLayout";

-- DropTable
DROP TABLE "BoosterSheet";

-- DropTable
DROP TABLE "SheetsInLayout";
