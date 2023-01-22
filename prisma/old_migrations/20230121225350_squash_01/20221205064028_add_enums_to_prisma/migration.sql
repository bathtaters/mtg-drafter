-- CreateEnum
CREATE TYPE "TabLabels" AS ENUM ('pack', 'main', 'side');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('start', 'active', 'end');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('join', 'leave');

-- CreateTable
CREATE TABLE "Enums" (
    "id" STRING NOT NULL,
    "TabLabels" "TabLabels" NOT NULL,
    "GameStatus" "GameStatus" NOT NULL,
    "PlayerStatus" "PlayerStatus" NOT NULL,

    CONSTRAINT "Enums_pkey" PRIMARY KEY ("id")
);
