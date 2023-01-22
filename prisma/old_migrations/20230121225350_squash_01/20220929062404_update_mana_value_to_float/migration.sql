/*
  Warnings:

  - The values [C] on the enum `Color` will be removed. If these variants are still used in the database, this will fail.
  - The `manaValue` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "Color" DROP VALUE 'C';

-- AlterTable
ALTER TABLE "Card" RENAME COLUMN "manaValue" TO "old_manaValue";
ALTER TABLE "Card" DROP COLUMN "old_manaValue";
ALTER TABLE "Card" ADD COLUMN     "manaValue" FLOAT8;
