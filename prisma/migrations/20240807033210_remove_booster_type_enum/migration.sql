/*
  Warnings:

  - The `boosterType` column on the `CardSet` table would be dropped and recreated. The current data is converted to a string and preserved.
  - Removed `BoosterType` Enum entirely from DB and types.

*/
-- AlterTable - Custom: Preserve layout column
ALTER TABLE "CardSet" ADD COLUMN "boosterType_new" STRING;
UPDATE "CardSet" SET "boosterType_new" = "boosterType"::STRING;
ALTER TABLE "CardSet" DROP COLUMN "boosterType";
ALTER TABLE "CardSet" RENAME COLUMN "boosterType_new" TO "boosterType";

-- AlterTable
ALTER TABLE "Enums" DROP COLUMN "BoosterType";

-- DropEnum
DROP TYPE "BoosterType";
