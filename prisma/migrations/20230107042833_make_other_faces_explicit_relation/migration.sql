/*
  Warnings:

  - You are about to drop the `_OtherFaceCards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OtherFaceCards" DROP CONSTRAINT "_OtherFaceCards_A_fkey";

-- DropForeignKey
ALTER TABLE "_OtherFaceCards" DROP CONSTRAINT "_OtherFaceCards_B_fkey";

-- CreateTable
CREATE TABLE "FaceInCard" (
    "selfId" STRING NOT NULL,
    "cardId" STRING NOT NULL,

    CONSTRAINT "FaceInCard_pkey" PRIMARY KEY ("selfId","cardId")
);

-- AddForeignKey
ALTER TABLE "FaceInCard" ADD CONSTRAINT "FaceInCard_selfId_fkey" FOREIGN KEY ("selfId") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaceInCard" ADD CONSTRAINT "FaceInCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- MigrateData
INSERT INTO "FaceInCard" ("selfId","cardId") SELECT "A","B" FROM "_OtherFaceCards";

-- DropTable
DROP TABLE "_OtherFaceCards";