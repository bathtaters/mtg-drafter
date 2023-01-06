/*
  Warnings:

  - Added the required column `BoosterType` to the `Enums` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BoosterType" AS ENUM ('none', 'default', 'arena', 'premium');

-- AlterTable
ALTER TABLE "Enums" ADD COLUMN     "BoosterType" "BoosterType" NOT NULL;

-- CreateTable
CREATE TABLE "CardSet" (
    "code" STRING NOT NULL,
    "name" STRING NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "block" STRING,

    CONSTRAINT "CardSet_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Booster" (
    "id" STRING NOT NULL,
    "totalWeight" INT4 NOT NULL,
    "boosterType" "BoosterType" NOT NULL,
    "setCode" STRING NOT NULL,

    CONSTRAINT "Booster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoosterLayout" (
    "id" STRING NOT NULL,
    "weight" INT4 NOT NULL,
    "boosterId" STRING NOT NULL,

    CONSTRAINT "BoosterLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoosterSheet" (
    "id" STRING NOT NULL,
    "count" INT4 NOT NULL,
    "layoutId" STRING NOT NULL,
    "sheetName" STRING NOT NULL,

    CONSTRAINT "BoosterSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardSheet" (
    "name" STRING NOT NULL,
    "totalWeight" INT4 NOT NULL,
    "foil" BOOL NOT NULL,
    "balanceColors" BOOL NOT NULL,

    CONSTRAINT "CardSheet_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "BoosterCard" (
    "id" STRING NOT NULL,
    "weight" INT4 NOT NULL,
    "sheetName" STRING NOT NULL,
    "cardId" STRING NOT NULL,

    CONSTRAINT "BoosterCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booster" ADD CONSTRAINT "Booster_setCode_fkey" FOREIGN KEY ("setCode") REFERENCES "CardSet"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterLayout" ADD CONSTRAINT "BoosterLayout_boosterId_fkey" FOREIGN KEY ("boosterId") REFERENCES "Booster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterSheet" ADD CONSTRAINT "BoosterSheet_sheetName_fkey" FOREIGN KEY ("sheetName") REFERENCES "CardSheet"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterSheet" ADD CONSTRAINT "BoosterSheet_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "BoosterLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterCard" ADD CONSTRAINT "BoosterCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BoosterCard" ADD CONSTRAINT "BoosterCard_sheetName_fkey" FOREIGN KEY ("sheetName") REFERENCES "CardSheet"("name") ON DELETE CASCADE ON UPDATE CASCADE;
