-- CreateEnum
CREATE TYPE "CardLayout" AS ENUM ('adventure', 'aftermath', 'art_series', 'augment', 'class', 'double_faced_token', 'emblem', 'flip', 'host', 'leveler', 'meld', 'modal_dfc', 'normal', 'planar', 'reversible_card', 'saga', 'scheme', 'split', 'token', 'transform', 'vanguard');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "layout" "CardLayout";
