/*
  Warnings:

  - The values [export] on the enum `LogAction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "LogAction" DROP VALUE 'export';
