-- DropForeignKey
ALTER TABLE "LogEntry" DROP CONSTRAINT "LogEntry_playerId_fkey";

-- AlterTable
ALTER TABLE "LogEntry" ALTER COLUMN "playerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
