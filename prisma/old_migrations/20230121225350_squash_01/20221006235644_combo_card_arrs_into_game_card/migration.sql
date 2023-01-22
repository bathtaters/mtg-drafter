/*
  Warnings:

  - You are about to drop the `PackCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PickedCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PackCard" DROP CONSTRAINT "PackCard_cardId_fkey";

-- DropForeignKey
ALTER TABLE "PackCard" DROP CONSTRAINT "PackCard_packId_fkey";

-- DropForeignKey
ALTER TABLE "PickedCard" DROP CONSTRAINT "PickedCard_cardId_fkey";

-- DropForeignKey
ALTER TABLE "PickedCard" DROP CONSTRAINT "PickedCard_playerId_fkey";

-- DropTable
DROP TABLE "PackCard";

-- DropTable
DROP TABLE "PickedCard";

-- CreateTable
CREATE TABLE "GameCard" (
    "id" STRING NOT NULL,
    "board" "Board" NOT NULL,
    "cardId" STRING NOT NULL,
    "packId" STRING NOT NULL,
    "playerId" STRING,

    CONSTRAINT "GameCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
