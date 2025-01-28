/*
  Warnings:

  - You are about to drop the column `watchId` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "watchId";

-- CreateTable
CREATE TABLE "WatchId" (
    "gameId" STRING NOT NULL,
    "sessionId" STRING NOT NULL,

    CONSTRAINT "WatchId_pkey" PRIMARY KEY ("sessionId","gameId")
);

-- CreateTable
CREATE TABLE "Ban" (
    "sessionId" STRING NOT NULL DEFAULT '',
    "gameId" STRING NOT NULL DEFAULT '',
    "note" STRING,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("sessionId","gameId")
);

-- AddForeignKey
ALTER TABLE "WatchId" ADD CONSTRAINT "WatchId_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
