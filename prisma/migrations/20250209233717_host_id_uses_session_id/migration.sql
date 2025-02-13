-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_hostId_fkey";

-- DropIndex
DROP INDEX "Game_hostId_key";

-- Convert Exisiting hostIds to sessionIds
UPDATE "Game" SET "hostId" = "sessionId"
FROM "Player" WHERE "hostId" = "Player"."id";
