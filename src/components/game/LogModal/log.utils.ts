import type { LogEntry, Player } from "@prisma/client"
import type { LogFull, LogOptions } from "types/game"
import { LogAction } from "@prisma/client"

export const additionalPlayers = ["game"] as const
export type PlayerFilter = typeof additionalPlayers[number] | Player['id']
export type FilterList = { id: PlayerFilter, name?: Player['name'] }[]

export const playerActions: LogAction[] = ['pick', 'rename', 'join', 'leave']
export const gameActions = Object.values(LogAction).filter((id) => !playerActions.includes(id))
export const actionBase = playerActions.concat(gameActions)
export const playerActionList = playerActions.map((id) => ({ id }))
export const gameActionList = gameActions.map((id) => ({ id }))
export const otherList: FilterList = additionalPlayers.map((id) => ({ id }))


export const filterLogs = (logs?: LogFull, players?: PlayerFilter[], actions?: LogEntry['action'][], options?: LogOptions) => 
  logs && logs.filter(({ playerId, byHost, action }) => 
    (!actions || actions.includes(action)) &&
    (!players || (
      (!playerId ? players.includes(additionalPlayers[0]) : 
      players.includes(playerId) && ( !byHost || !options?.hideHost ))
    ))
  )
