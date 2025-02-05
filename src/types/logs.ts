import type { Player } from "types/game"
import { LogAction } from "@prisma/client"

export type FilterId = Player['id']
export type FilterList = { id: FilterId, name?: Player['name'] }[]

export const otherPlayers: FilterId[] = ["game", "other"]
export const otherList: FilterList = otherPlayers.map((id) => ({ id }))

export const playerActions: LogAction[] = ['pick', 'rename', 'join', 'leave']
export const playerActionList = playerActions.map((id) => ({ id }))

export const gameActions = Object.values(LogAction).filter((id) => !playerActions.includes(id))
export const gameActionList = gameActions.map((id) => ({ id }))

export const allActions = playerActions.concat(gameActions)

