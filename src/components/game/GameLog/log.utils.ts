import type { LogEntry } from "@prisma/client"
import type { Player, LogFull, LogOptions } from "types/game"
import { LogAction } from "@prisma/client"

type FilterId = Player['id']
export type FilterList = { id: FilterId, name?: Player['name'] }[]

// Initialize filter lists

export const otherPlayers: FilterId[] = ["game", "other"]
export const otherList: FilterList = otherPlayers.map((id) => ({ id }))

export const playerActions: LogAction[] = ['pick', 'rename', 'join', 'leave']
export const playerActionList = playerActions.map((id) => ({ id }))

export const gameActions = Object.values(LogAction).filter((id) => !playerActions.includes(id))
export const gameActionList = gameActions.map((id) => ({ id }))

export const allActions = playerActions.concat(gameActions)


export const filterLogs = (logs: LogFull | undefined, players: FilterId[], actions: LogEntry['action'][], options: LogOptions) => 
  logs && logs.filter(({ playerId, byHost, action }) => 
    actions.includes(action) &&
    // No player for Ban/Unban = 'other'; No player for other actions = 'game'
    players.includes(playerId || (action === 'ban' || action === 'unban' ? "other" : "game" )) &&
    // Hide playerActions done by host
    ( !playerId || !byHost || !options?.hideHost )
  )
