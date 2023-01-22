/*
  Warnings:

  - A unique constraint covering the columns `[gameId,sessionId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Player_sessionId_gameId_key";

-- AlterTable
ALTER TABLE "GameCard" ADD COLUMN     "imgSrc" STRING;

-- CreateIndex
CREATE INDEX "Player_gameId_sessionId_idx" ON "Player"("gameId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_sessionId_key" ON "Player"("gameId", "sessionId");
