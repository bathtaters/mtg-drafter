import type { LogEntry, Player } from "@prisma/client"
import type { LogFull, LogOptions } from "types/game"
import { LogAction } from "@prisma/client"

type FilterId = Player['id']
export type FilterList = { id: FilterId, name?: Player['name'] }[]

// Initialize filter lists

export const otherPlayers: FilterId[] = ["game"]
export const otherList: FilterList = otherPlayers.map((id) => ({ id }))

export const playerActions: LogAction[] = ['pick', 'rename', 'join', 'leave']
export const playerActionList = playerActions.map((id) => ({ id }))

export const gameActions = Object.values(LogAction).filter((id) => !playerActions.includes(id))
export const gameActionList = gameActions.map((id) => ({ id }))

export const allActions = playerActions.concat(gameActions)


export const filterLogs = (logs: LogFull | undefined, players: FilterId[], actions: LogEntry['action'][], options: LogOptions) => 
  logs && logs.filter(({ playerId, byHost, action }) => 
    actions.includes(action) && players.includes(playerId || "game") &&
      ( !playerId || !byHost || !options?.hideHost ) // Hide playerActions done by host
  )
