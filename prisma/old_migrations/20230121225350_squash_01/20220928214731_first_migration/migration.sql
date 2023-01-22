-- CreateEnum
CREATE TYPE "Color" AS ENUM ('W', 'U', 'B', 'R', 'G', 'C');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('common', 'uncommon', 'rare', 'mythic', 'bonus', 'special');

-- CreateEnum
CREATE TYPE "Side" AS ENUM ('a', 'b');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('String', 'Number', 'Boolean', 'Date', 'Timestamp', 'JSON', 'StringList', 'NumberList', 'BooleanList', 'DateList', 'TimestampList');

-- CreateTable
CREATE TABLE "Settings" (
    "id" STRING NOT NULL,
    "type" "DataType" NOT NULL,
    "value" STRING,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "url" STRING NOT NULL,
    "round" INT4 NOT NULL DEFAULT 0,
    "roundCount" INT4 NOT NULL,
    "isPaused" BOOL NOT NULL DEFAULT false,
    "hostId" INT8,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "uuid" STRING NOT NULL,
    "name" STRING NOT NULL,
    "setCode" STRING NOT NULL,
    "manaCost" STRING,
    "type" STRING NOT NULL,
    "text" STRING,
    "footer" STRING,
    "rarity" "Rarity" NOT NULL,
    "colors" "Color"[],
    "types" STRING[],
    "manaValue" INT4 NOT NULL,
    "monoColor" "Color",
    "scryfallId" STRING,
    "multiverseId" STRING,
    "noGath" BOOL NOT NULL,
    "skipArt" BOOL NOT NULL DEFAULT false,
    "faceName" STRING,
    "side" "Side",
    "printings" STRING[],

    CONSTRAINT "Card_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Pack" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "gameId" STRING NOT NULL,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING,
    "sessionId" STRING,
    "pick" INT4 NOT NULL DEFAULT 0,
    "basics" JSONB NOT NULL DEFAULT '{"w":0,"u":0,"b":0,"r":0,"g":0}',
    "gameId" STRING NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CardToPack" (
    "A" STRING NOT NULL,
    "B" INT8 NOT NULL
);

-- CreateTable
CREATE TABLE "_MainBoard" (
    "A" STRING NOT NULL,
    "B" INT8 NOT NULL
);

-- CreateTable
CREATE TABLE "_SideBoard" (
    "A" STRING NOT NULL,
    "B" INT8 NOT NULL
);

-- CreateTable
CREATE TABLE "_OtherFaceCards" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_SetVariations" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_url_key" ON "Game"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Game_hostId_key" ON "Game"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_scryfallId_key" ON "Card"("scryfallId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_multiverseId_key" ON "Card"("multiverseId");

-- CreateIndex
CREATE INDEX "Card_name_idx" ON "Card"("name");

-- CreateIndex
CREATE INDEX "Card_name_setCode_idx" ON "Card"("name", "setCode");

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

-- CreateIndex
CREATE UNIQUE INDEX "_OtherFaceCards_AB_unique" ON "_OtherFaceCards"("A", "B");

-- CreateIndex
CREATE INDEX "_OtherFaceCards_B_index" ON "_OtherFaceCards"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SetVariations_AB_unique" ON "_SetVariations"("A", "B");

-- CreateIndex
CREATE INDEX "_SetVariations_B_index" ON "_SetVariations"("B");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToPack" ADD CONSTRAINT "_CardToPack_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToPack" ADD CONSTRAINT "_CardToPack_B_fkey" FOREIGN KEY ("B") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MainBoard" ADD CONSTRAINT "_MainBoard_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MainBoard" ADD CONSTRAINT "_MainBoard_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SideBoard" ADD CONSTRAINT "_SideBoard_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SideBoard" ADD CONSTRAINT "_SideBoard_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OtherFaceCards" ADD CONSTRAINT "_OtherFaceCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OtherFaceCards" ADD CONSTRAINT "_OtherFaceCards_B_fkey" FOREIGN KEY ("B") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetVariations" ADD CONSTRAINT "_SetVariations_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetVariations" ADD CONSTRAINT "_SetVariations_B_fkey" FOREIGN KEY ("B") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
