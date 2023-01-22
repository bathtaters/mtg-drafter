/*
  Warnings:

  - You are about to drop the `_MainBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SideBoard` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[hostId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Board" AS ENUM ('main', 'side');

-- DropForeignKey
ALTER TABLE "_MainBoard" DROP CONSTRAINT "_MainBoard_A_fkey";

-- DropForeignKey
ALTER TABLE "_MainBoard" DROP CONSTRAINT "_MainBoard_B_fkey";

-- DropForeignKey
ALTER TABLE "_SideBoard" DROP CONSTRAINT "_SideBoard_A_fkey";

-- DropForeignKey
ALTER TABLE "_SideBoard" DROP CONSTRAINT "_SideBoard_B_fkey";

-- DropTable
DROP TABLE "_MainBoard";

-- DropTable
DROP TABLE "_SideBoard";

-- CreateTable
CREATE TABLE "PickedCard" (
    "id" STRING NOT NULL,
    "board" "Board" NOT NULL,
    "cardId" STRING NOT NULL,
    "playerId" STRING NOT NULL,

    CONSTRAINT "PickedCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_hostId_key" ON "Game"("hostId");

-- AddForeignKey
ALTER TABLE "PickedCard" ADD CONSTRAINT "PickedCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PickedCard" ADD CONSTRAINT "PickedCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
