-- DropIndex
DROP INDEX "Card_name_idx";

-- DropIndex
DROP INDEX "Card_name_setCode_idx";

-- CreateIndex
CREATE INDEX "Card_normalName_idx" ON "Card"("normalName");
