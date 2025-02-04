import type { LogEntry } from "@prisma/client"
import type { Player, LogOptions, LogEntryFull } from "types/game"
import type { FetchParams } from "./log.controller"
import { LogAction } from "@prisma/client"
import { logFetchOptions } from "assets/constants"

type FilterId = Player['id']
export type FilterList = { id: FilterId, name?: Player['name'] }[]

export const adaptEntry = <L extends Partial<LogEntry>>(entry: L) => ({ ...entry, time: entry.time && new Date(entry.time) })

export const toLogParams = (nums: number[]): Pick<FetchParams, 'offset'|'size'> => {
  if (!nums.length) return { offset: 0, size: 0 }

  let offset = nums[0], end = nums[0]
  for (const num of nums) {
    // Find min/max, stopping early if max size is reached
    if (num < offset) {
      offset = num
      if (end - offset > logFetchOptions.maxSize)
        return { offset, size: logFetchOptions.maxSize }
      
    } else if (num > end) {
      end = num
      if (end - offset > logFetchOptions.maxSize)
        return { offset: end - logFetchOptions.maxSize, size: logFetchOptions.maxSize }
    }
  }
  return { offset, size: Math.max(end - offset + 1, logFetchOptions.defaultSize) }
}

// Initialize filter lists

export const otherPlayers: FilterId[] = ["game", "other"]
export const otherList: FilterList = otherPlayers.map((id) => ({ id }))

export const playerActions: LogAction[] = ['pick', 'rename', 'join', 'leave']
export const playerActionList = playerActions.map((id) => ({ id }))

export const gameActions = Object.values(LogAction).filter((id) => !playerActions.includes(id))
export const gameActionList = gameActions.map((id) => ({ id }))

export const allActions = playerActions.concat(gameActions)


export const filterEntry = (entry: LogEntryFull | undefined, players: FilterId[], actions: LogEntry['action'][], options: LogOptions) => 
  !entry || (
    actions.includes(entry.action) &&
    // No player for Ban/Unban = 'other'; No player for other actions = 'game'
    players.includes(entry.playerId || (entry.action === 'ban' || entry.action === 'unban' ? "other" : "game" )) &&
    // Hide playerActions done by host
    ( !entry.playerId || !entry.byHost || !options?.hideHost || entry.action === 'ban' )
  )
