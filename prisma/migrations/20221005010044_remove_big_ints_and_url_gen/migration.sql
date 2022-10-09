/*
  Warnings:

  - The `hostId` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `id` on the `Pack` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `Player` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - Changed the type of `B` on the `_CardToPack` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_MainBoard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_SideBoard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_hostId_fkey";

-- DropForeignKey
ALTER TABLE "_CardToPack" DROP CONSTRAINT "_CardToPack_B_fkey";

-- DropForeignKey
ALTER TABLE "_MainBoard" DROP CONSTRAINT "_MainBoard_B_fkey";

-- DropForeignKey
ALTER TABLE "_SideBoard" DROP CONSTRAINT "_SideBoard_B_fkey";

-- DropIndex
DROP INDEX "Game_hostId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "hostId";
ALTER TABLE "Game" ADD COLUMN     "hostId" STRING;

-- AlterTable
ALTER TABLE "_CardToPack" DROP COLUMN "B";
ALTER TABLE "_CardToPack" ADD COLUMN     "B" STRING NOT NULL;

-- AlterTable
ALTER TABLE "_MainBoard" DROP COLUMN "B";
ALTER TABLE "_MainBoard" ADD COLUMN     "B" STRING NOT NULL;

-- AlterTable
ALTER TABLE "_SideBoard" DROP COLUMN "B";
ALTER TABLE "_SideBoard" ADD COLUMN     "B" STRING NOT NULL;

-- RedefineTables
CREATE TABLE "_prisma_new_Pack" (
    "id" STRING NOT NULL,
    "gameId" STRING NOT NULL,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Pack" ("gameId","id") SELECT "gameId","id" FROM "Pack";
DROP TABLE "Pack" CASCADE;
ALTER TABLE "_prisma_new_Pack" RENAME TO "Pack";
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_Player" (
    "id" STRING NOT NULL,
    "name" STRING,
    "sessionId" STRING,
    "pick" INT4 NOT NULL DEFAULT 0,
    "basics" JSONB NOT NULL DEFAULT '{"w":0,"u":0,"b":0,"r":0,"g":0}',
    "gameId" STRING NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
DROP INDEX "Player_sessionId_gameId_key";
INSERT INTO "_prisma_new_Player" ("basics","gameId","id","name","pick","sessionId") SELECT "basics","gameId","id","name","pick","sessionId" FROM "Player";
DROP TABLE "Player" CASCADE;
ALTER TABLE "_prisma_new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_sessionId_gameId_key" ON "Player"("sessionId", "gameId");
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "_CardToPack_AB_unique" ON "_CardToPack"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToPack_B_index" ON "_CardToPack"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MainBoard_AB_unique" ON "_MainBoard"("A", "B");

-- CreateIndex
CREATE INDEX "_MainBoard_B_index" ON "_MainBoard"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SideBoard_AB_unique" ON "_SideBoard"("A", "B");

-- CreateIndex
CREATE INDEX "_SideBoard_B_index" ON "_SideBoard"("B");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToPack" ADD CONSTRAINT "_CardToPack_B_fkey" FOREIGN KEY ("B") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MainBoard" ADD CONSTRAINT "_MainBoard_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SideBoard" ADD CONSTRAINT "_SideBoard_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
