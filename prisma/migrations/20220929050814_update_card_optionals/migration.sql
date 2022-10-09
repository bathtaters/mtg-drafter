-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "setCode" DROP NOT NULL;
ALTER TABLE "Card" ALTER COLUMN "type" DROP NOT NULL;
ALTER TABLE "Card" ALTER COLUMN "rarity" DROP NOT NULL;
ALTER TABLE "Card" ALTER COLUMN "manaValue" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Widget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);
