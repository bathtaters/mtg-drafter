/*
  Warnings:

  - The values [none,premium] on the enum `BoosterType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `boosterId` on the `BoosterLayout` table. All the data in the column will be lost.
  - You are about to drop the `Booster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardSheet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `count` on the `BoosterSheet` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `BoosterSheet` table. All the data in the column will be lost.
  - You are about to drop the column `layoutId` on the `BoosterSheet` table. All the data in the column will be lost.
  - You are about to drop the column `sheetName` on the `BoosterSheet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[setCode,id]` on the table `BoosterLayout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sheetSet` to the `BoosterCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setCode` to the `BoosterLayout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boosterType` to the `CardSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `CardSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceColors` to the `BoosterSheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foil` to the `BoosterSheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `BoosterSheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setCode` to the `BoosterSheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `BoosterSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BoosterType"DROP VALUE 'none';
ALTER TYPE "BoosterType"DROP VALUE 'premium';

-- DropForeignKey
ALTER TABLE "Booster" DROP CONSTRAINT "Booster_setCode_fkey";

-- DropForeignKey
ALTER TABLE "BoosterCard" DROP CONSTRAINT "BoosterCard_sheetName_fkey";

-- DropForeignKey
ALTER TABLE "BoosterLayout" DROP CONSTRAINT "BoosterLayout_boosterId_fkey";

-- AlterTable
ALTER TABLE "BoosterCard" ADD COLUMN     "sheetSet" STRING NOT NULL;

-- AlterTable
ALTER TABLE "BoosterLayout" DROP COLUMN "boosterId";
ALTER TABLE "BoosterLayout" ADD COLUMN     "setCode" STRING NOT NULL;

-- AlterTable
ALTER TABLE "CardSet" ADD COLUMN     "boosterType" "BoosterType" NOT NULL;
ALTER TABLE "CardSet" ADD COLUMN     "totalWeight" INT4 NOT NULL;

-- DropTable
DROP TABLE "Booster";

-- CreateTable
CREATE TABLE "SheetsInLayout" (
    "selectCount" INT4 NOT NULL,
    "layoutId" STRING NOT NULL,
    "sheetName" STRING NOT NULL,
    "setCode" STRING NOT NULL,

    CONSTRAINT "SheetsInLayout_pkey" PRIMARY KEY ("layoutId","sheetName")
);

-- RedefineTables
CREATE TABLE "_prisma_new_BoosterSheet" (
    "name" STRING NOT NULL,
    "foil" BOOL NOT NULL,
    "balanceColors" BOOL NOT NULL,
    "totalWeight" INT4 NOT NULL,
    "setCode" STRING NOT NULL,

    CONSTRAINT "BoosterSheet_pkey" PRIMARY KEY ("setCode","name")
);
DROP TABLE "BoosterSheet" CASCADE;
ALTER TABLE "_prisma_new_BoosterSheet" RENAME TO "BoosterSheet";
ALTER TABLE "BoosterSheet" ADD CONSTRAINT "BoosterSheet_setCode_fkey" FOREIGN KEY ("setCode") REFERENCES "CardSet"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable (Moved after BoosterSheet due to Foreign Key constraint error)
DROP TABLE "CardSheet";

-- CreateIndex
CREATE INDEX "BoosterLayout_setCode_idx" ON "BoosterLayout"("setCode");

-- CreateIndex
CREATE UNIQUE INDEX "BoosterLayout_setCode_id_key" ON "BoosterLayout"("setCode", "id");

-- AddForeignKey
ALTER TABLE "BoosterLayout" ADD CONSTRAINT "BoosterLayout_setCode_fkey" FOREIGN KEY ("setCode") REFERENCES "CardSet"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetsInLayout" ADD CONSTRAINT "SheetsInLayout_setCode_sheetName_fkey" FOREIGN KEY ("setCode", "sheetName") REFERENCES "BoosterSheet"("setCode", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetsInLayout" ADD CONSTRAINT "SheetsInLayout_setCode_layoutId_fkey" FOREIGN KEY ("setCode", "layoutId") REFERENCES "BoosterLayout"("setCode", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterCard" ADD CONSTRAINT "BoosterCard_sheetSet_sheetName_fkey" FOREIGN KEY ("sheetSet", "sheetName") REFERENCES "BoosterSheet"("setCode", "name") ON DELETE CASCADE ON UPDATE CASCADE;
