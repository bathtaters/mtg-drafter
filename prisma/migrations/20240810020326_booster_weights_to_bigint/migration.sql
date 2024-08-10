/*
  Warnings:

  - The `weight` column on the `BoosterCard` table would be would be dropped and recreated. The current data is converted to a bigint and preserved.
  - The `weight` column on the `BoosterLayout` table would be dropped and recreated. The current data is converted to a bigint and preserved.
  - The `totalWeight` column on the `BoosterSheet` table would be dropped and recreated. The current data is converted to a bigint and preserved.
  - The `totalWeight` column on the `CardSet` table would be dropped and recreated. The current data is converted to a bigint and preserved.
  - Made the column `boosterType` on table `CardSet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable - Custom: Preserve weight column
ALTER TABLE "BoosterCard" ADD COLUMN    "weight_new" INT8 NOT NULL DEFAULT 0;
UPDATE      "BoosterCard" SET           "weight_new" = "weight"::INT8;
ALTER TABLE "BoosterCard" DROP COLUMN   "weight";
ALTER TABLE "BoosterCard" RENAME COLUMN "weight_new" TO "weight";

-- AlterTable - Custom: Preserve weight column
ALTER TABLE "BoosterLayout" ADD COLUMN    "weight_new" INT8 NOT NULL DEFAULT 0;
UPDATE      "BoosterLayout" SET           "weight_new" = "weight"::INT8;
ALTER TABLE "BoosterLayout" DROP COLUMN   "weight";
ALTER TABLE "BoosterLayout" RENAME COLUMN "weight_new" TO "weight";

-- AlterTable - Custom: Preserve totalWeight column
ALTER TABLE "BoosterSheet" ADD COLUMN    "totalWeight_new" INT8 NOT NULL DEFAULT 0;
UPDATE      "BoosterSheet" SET           "totalWeight_new" = "totalWeight"::INT8;
ALTER TABLE "BoosterSheet" DROP COLUMN   "totalWeight";
ALTER TABLE "BoosterSheet" RENAME COLUMN "totalWeight_new" TO "totalWeight";

-- AlterTable - Custom: Preserve totalWeight column
ALTER TABLE "CardSet" ADD COLUMN    "totalWeight_new" INT8 NOT NULL DEFAULT 0;
UPDATE      "CardSet" SET           "totalWeight_new" = "totalWeight"::INT8;
ALTER TABLE "CardSet" DROP COLUMN   "totalWeight";
ALTER TABLE "CardSet" RENAME COLUMN "totalWeight_new" TO "totalWeight";

-- AlterTable
ALTER TABLE "CardSet" ALTER COLUMN "boosterType" SET NOT NULL;
