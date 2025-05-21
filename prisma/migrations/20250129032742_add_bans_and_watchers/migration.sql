/*
  Warnings:

  - You are about to drop the column `watchId` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "watchId";

-- CreateTable
CREATE TABLE "Watcher" (
    "gameId" STRING NOT NULL,
    "sessionId" STRING NOT NULL,

    CONSTRAINT "Watcher_pkey" PRIMARY KEY ("sessionId","gameId")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" STRING NOT NULL,
    "sessionId" STRING,
    "gameId" STRING,
    "name" STRING,
    "note" STRING,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ban_sessionId_gameId_key" ON "Ban"("sessionId", "gameId");

-- AddForeignKey
ALTER TABLE "Watcher" ADD CONSTRAINT "Watcher_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
