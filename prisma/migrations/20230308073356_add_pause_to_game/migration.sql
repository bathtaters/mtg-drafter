/*
  Warnings:

  - You are about to drop the column `isPaused` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "isPaused";
ALTER TABLE "Game" ADD COLUMN     "pause" INT8;
