/*
  Warnings:

  - The `releaseDate` column on the `CardSet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CardSet" DROP COLUMN "releaseDate";
ALTER TABLE "CardSet" ADD COLUMN     "releaseDate" STRING;
