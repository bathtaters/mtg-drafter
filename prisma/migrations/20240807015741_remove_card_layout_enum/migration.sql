/*
  Warnings:

  - The `layout` column on the `Card` table would be dropped and recreated. The current data is converted to a string and preserved.
  - Removed `CardLayout` Enum entirely from DB and types.

*/
-- AlterTable - Custom: Preserve layout column
ALTER TABLE "Card" ADD COLUMN "layout_new" STRING;
UPDATE "Card" SET "layout_new" = "layout"::STRING;
ALTER TABLE "Card" DROP COLUMN "layout";
ALTER TABLE "Card" RENAME COLUMN "layout_new" TO "layout";

-- AlterTable
ALTER TABLE "Enums" DROP COLUMN "CardLayout";

-- DropEnum
DROP TYPE "CardLayout";
