-- AlterEnum
ALTER TYPE "LogAction" ADD VALUE 'view';

-- AlterTable
ALTER TABLE "LogEntry" ADD COLUMN     "sessionId" STRING;
