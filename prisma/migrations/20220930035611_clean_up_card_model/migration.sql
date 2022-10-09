/*
  Warnings:

  - You are about to drop the column `printings` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the `Widget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SetVariations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionId,gameId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_SetVariations" DROP CONSTRAINT "_SetVariations_A_fkey";

-- DropForeignKey
ALTER TABLE "_SetVariations" DROP CONSTRAINT "_SetVariations_B_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "printings";

-- DropTable
DROP TABLE "Widget";

-- DropTable
DROP TABLE "_SetVariations";

-- CreateIndex
CREATE UNIQUE INDEX "Player_sessionId_gameId_key" ON "Player"("sessionId", "gameId");
