-- CreateEnum
CREATE TYPE "Color" AS ENUM ('W', 'U', 'B', 'R', 'G');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('common', 'uncommon', 'rare', 'mythic', 'bonus', 'special');

-- CreateEnum
CREATE TYPE "Side" AS ENUM ('a', 'b', 'c', 'd', 'e');

-- CreateEnum
CREATE TYPE "BoosterType" AS ENUM ('default', 'arena');

-- CreateEnum
CREATE TYPE "Board" AS ENUM ('main', 'side');

-- CreateEnum
CREATE TYPE "TabLabels" AS ENUM ('pack', 'main', 'side');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('start', 'active', 'last', 'end');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('join', 'leave');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('pick', 'join', 'leave', 'rename', 'round', 'settings');

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
    "packSize" INT4 NOT NULL,
    "roundCount" INT4 NOT NULL,
    "round" INT4 NOT NULL DEFAULT 0,
    "isPaused" BOOL NOT NULL DEFAULT false,
    "timerBase" INT4,
    "hostId" STRING,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "uuid" STRING NOT NULL,
    "name" STRING NOT NULL,
    "normalName" STRING,
    "setCode" STRING,
    "manaCost" STRING,
    "type" STRING,
    "text" STRING,
    "footer" STRING,
    "rarity" "Rarity",
    "colors" "Color"[],
    "types" STRING[],
    "manaValue" FLOAT8,
    "monoColor" "Color",
    "img" STRING,
    "scryfallId" STRING,
    "multiverseId" STRING,
    "preferredArt" BOOL NOT NULL DEFAULT false,
    "faceName" STRING,
    "side" "Side",

    CONSTRAINT "Card_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "FaceInCard" (
    "selfId" STRING NOT NULL,
    "cardId" STRING NOT NULL,

    CONSTRAINT "FaceInCard_pkey" PRIMARY KEY ("selfId","cardId")
);

-- CreateTable
CREATE TABLE "CardSet" (
    "code" STRING NOT NULL,
    "name" STRING NOT NULL,
    "releaseDate" STRING,
    "block" STRING,
    "totalWeight" INT4 NOT NULL DEFAULT 0,
    "boosterType" "BoosterType" NOT NULL,

    CONSTRAINT "CardSet_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" STRING NOT NULL,
    "name" STRING,
    "sessionId" STRING,
    "pick" INT4 NOT NULL DEFAULT 0,
    "timer" INT8,
    "basics" JSONB NOT NULL DEFAULT '{"main":{"w":0,"u":0,"b":0,"r":0,"g":0},"side":{"w":0,"u":0,"b":0,"r":0,"g":0}}',
    "gameId" STRING NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pack" (
    "gameId" STRING NOT NULL,
    "index" INT4 NOT NULL,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("gameId","index")
);

-- CreateTable
CREATE TABLE "GameCard" (
    "id" STRING NOT NULL,
    "foil" BOOL NOT NULL DEFAULT false,
    "board" "Board" NOT NULL DEFAULT 'main',
    "cardId" STRING NOT NULL,
    "gameId" STRING NOT NULL,
    "packIdx" INT4 NOT NULL,
    "playerId" STRING,

    CONSTRAINT "GameCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" STRING NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "LogAction" NOT NULL,
    "data" STRING,
    "byHost" BOOL NOT NULL DEFAULT false,
    "gameId" STRING NOT NULL,
    "playerId" STRING,
    "cardId" STRING,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoosterLayout" (
    "setCode" STRING NOT NULL,
    "index" INT4 NOT NULL,
    "weight" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "BoosterLayout_pkey" PRIMARY KEY ("setCode","index")
);

-- CreateTable
CREATE TABLE "SheetsInLayout" (
    "setCode" STRING NOT NULL,
    "layoutIdx" INT4 NOT NULL,
    "sheetName" STRING NOT NULL,
    "selectCount" INT4 NOT NULL DEFAULT 1,

    CONSTRAINT "SheetsInLayout_pkey" PRIMARY KEY ("setCode","layoutIdx","sheetName")
);

-- CreateTable
CREATE TABLE "BoosterSheet" (
    "setCode" STRING NOT NULL,
    "name" STRING NOT NULL,
    "foil" BOOL NOT NULL DEFAULT false,
    "balanceColors" BOOL NOT NULL DEFAULT false,
    "totalWeight" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "BoosterSheet_pkey" PRIMARY KEY ("setCode","name")
);

-- CreateTable
CREATE TABLE "BoosterCard" (
    "id" STRING NOT NULL,
    "weight" INT4 NOT NULL DEFAULT 0,
    "setCode" STRING NOT NULL,
    "sheetName" STRING NOT NULL,
    "cardId" STRING NOT NULL,

    CONSTRAINT "BoosterCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enums" (
    "id" STRING NOT NULL,
    "TabLabels" "TabLabels" NOT NULL,
    "GameStatus" "GameStatus" NOT NULL,
    "PlayerStatus" "PlayerStatus" NOT NULL,
    "LogAction" "LogAction" NOT NULL,
    "BoosterType" "BoosterType" NOT NULL,

    CONSTRAINT "Enums_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_url_key" ON "Game"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Game_hostId_key" ON "Game"("hostId");

-- CreateIndex
CREATE INDEX "Card_name_idx" ON "Card"("name");

-- CreateIndex
CREATE INDEX "Card_name_setCode_idx" ON "Card"("name", "setCode");

-- CreateIndex
CREATE INDEX "Player_gameId_idx" ON "Player"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_sessionId_key" ON "Player"("gameId", "sessionId");

-- CreateIndex
CREATE INDEX "BoosterCard_setCode_sheetName_idx" ON "BoosterCard"("setCode", "sheetName");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaceInCard" ADD CONSTRAINT "FaceInCard_selfId_fkey" FOREIGN KEY ("selfId") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaceInCard" ADD CONSTRAINT "FaceInCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_gameId_packIdx_fkey" FOREIGN KEY ("gameId", "packIdx") REFERENCES "Pack"("gameId", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "GameCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterLayout" ADD CONSTRAINT "BoosterLayout_setCode_fkey" FOREIGN KEY ("setCode") REFERENCES "CardSet"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetsInLayout" ADD CONSTRAINT "SheetsInLayout_setCode_layoutIdx_fkey" FOREIGN KEY ("setCode", "layoutIdx") REFERENCES "BoosterLayout"("setCode", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetsInLayout" ADD CONSTRAINT "SheetsInLayout_setCode_sheetName_fkey" FOREIGN KEY ("setCode", "sheetName") REFERENCES "BoosterSheet"("setCode", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterSheet" ADD CONSTRAINT "BoosterSheet_setCode_fkey" FOREIGN KEY ("setCode") REFERENCES "CardSet"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterCard" ADD CONSTRAINT "BoosterCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BoosterCard" ADD CONSTRAINT "BoosterCard_setCode_sheetName_fkey" FOREIGN KEY ("setCode", "sheetName") REFERENCES "BoosterSheet"("setCode", "name") ON DELETE CASCADE ON UPDATE CASCADE;

