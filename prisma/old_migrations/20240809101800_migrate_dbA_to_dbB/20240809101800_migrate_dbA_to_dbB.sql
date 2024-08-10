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

-- AlterTable - Custom: Preserve layout column
ALTER TABLE "Card" ADD COLUMN    "layout_new" STRING;
UPDATE      "Card" SET           "layout_new" = "layout"::STRING;
ALTER TABLE "Card" DROP COLUMN   "layout";
ALTER TABLE "Card" RENAME COLUMN "layout_new" TO "layout";

-- AlterTable - Custom: Preserve layout column
ALTER TABLE "CardSet" ADD COLUMN    "boosterType_new" STRING;
UPDATE      "CardSet" SET           "boosterType_new" = "boosterType"::STRING;
ALTER TABLE "CardSet" DROP COLUMN   "boosterType";
ALTER TABLE "CardSet" RENAME COLUMN "boosterType_new" TO "boosterType";

-- AlterTable - Custom: Preserve totalWeight column
ALTER TABLE "CardSet" ADD COLUMN    "totalWeight_new" INT8 NOT NULL DEFAULT 0;
UPDATE      "CardSet" SET           "totalWeight_new" = "totalWeight"::INT8;
ALTER TABLE "CardSet" DROP COLUMN   "totalWeight";
ALTER TABLE "CardSet" RENAME COLUMN "totalWeight_new" TO "totalWeight";

-- AlterTable
ALTER TABLE "Enums" DROP COLUMN "BoosterType";

-- DropEnum
DROP TYPE "BoosterType";

-- DropEnum
DROP TYPE "CardLayout";

-- AlterTable -- WARNING: Will fail if boosterType contains any NULL
ALTER TABLE "CardSet" ALTER COLUMN "boosterType" SET NOT NULL;