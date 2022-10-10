import type { Board } from "@prisma/client"
export type { CubeOptions } from "backend/services/game/createGame"

export type BoardLands = { w: number, u: number, b: number, r: number, g: number }

export type BasicLands = { [board in Board]: BoardLands }

export type PlayerStatus = "join" | "leave"