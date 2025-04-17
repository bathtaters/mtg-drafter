-- Add 'view' action to Log
ALTER TYPE "LogAction" ADD VALUE 'view';

-- Add new LogEntry columns
ALTER TABLE "LogEntry" ADD COLUMN "sessionId" STRING;
ALTER TABLE "LogEntry" ADD COLUMN "hostId" STRING;

-- Migrate 'byHost' to 'hostId'
UPDATE "LogEntry" SET "hostId" = '__ALL__' WHERE "byHost" IS TRUE;
ALTER TABLE "LogEntry" DROP COLUMN "byHost";