/*
  Warnings:

  - You are about to drop the `_CardToPack` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gameId,index]` on the table `Pack` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `Pack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CardToPack" DROP CONSTRAINT "_CardToPack_A_fkey";

-- DropForeignKey
ALTER TABLE "_CardToPack" DROP CONSTRAINT "_CardToPack_B_fkey";

-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "index" INT4 NOT NULL;

-- DropTable
DROP TABLE "_CardToPack";

-- CreateTable
CREATE TABLE "PackCard" (
    "id" STRING NOT NULL,
    "index" INT4 NOT NULL,
    "packId" STRING NOT NULL,
    "cardId" STRING NOT NULL,

    CONSTRAINT "PackCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackCard_packId_index_key" ON "PackCard"("packId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Pack_gameId_index_key" ON "Pack"("gameId", "index");

-- AddForeignKey
ALTER TABLE "PackCard" ADD CONSTRAINT "PackCard_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackCard" ADD CONSTRAINT "PackCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;
