/*
  Warnings:

  - Added the required column `LogAction` to the `Enums` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('pick', 'join', 'leave', 'rename', 'export', 'round', 'settings');

-- AlterTable
ALTER TABLE "Enums" ADD COLUMN     "LogAction" "LogAction" NOT NULL;

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" STRING NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "LogAction" NOT NULL,
    "data" STRING,
    "byHost" BOOL NOT NULL DEFAULT false,
    "gameId" STRING NOT NULL,
    "playerId" STRING NOT NULL,
    "cardId" STRING,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "GameCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
