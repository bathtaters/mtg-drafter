-- AlterEnum
ALTER TYPE "PlayerStatus" ADD VALUE 'bot';

-- DropIndex
DROP INDEX "Player_gameId_sessionId_key";
