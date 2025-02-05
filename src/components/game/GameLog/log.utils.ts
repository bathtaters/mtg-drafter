import type { LogEntry } from "@prisma/client"
import type { LogOptions, LogEntryFull } from "types/game"
import type { FilterId } from "types/logs"
import type { FetchParams } from "./log.controller"
import { logFetchOptions } from "assets/constants"

export const adaptEntry = <L extends Partial<LogEntry>>(entry: L) => ({ ...entry, time: entry.time && new Date(entry.time) })

const { defaultSize, maxSize } = logFetchOptions
export const toLogParams = (nums: number[], total?: number): Pick<FetchParams, 'offset'|'size'> => {
  if (!nums.length) return { offset: 0, size: 0 }

  let offset = nums[0], end = nums[0]
  for (const num of nums) {
    // Find min/max, stopping early if max size is reached
    if (num < offset) {
      offset = num
      if (end - offset > maxSize)
        return { offset, size: maxSize }
      
    } else if (num > end) {
      end = num
      if (end - offset > maxSize)
        return { offset: end - maxSize, size: maxSize }
    }
  }
  
  let size = end - offset + 1
  // Resize range based on screen location & scroll direction
  if (size < defaultSize) {
    if (end - defaultSize <= 0) offset = 0
    else if (total == null) offset = Math.max(end - defaultSize + 1, 0)
    else if (offset + defaultSize > total) offset = total - defaultSize
    else if (nums[0] >= nums[nums.length - 1]) // AKA Moving downa
      offset = Math.max(end - defaultSize + 1, 0)
    // If Moving up, keep offset
    size = defaultSize
  }

  return { offset, size }
}


export const filterEntry = (entry: LogEntryFull | undefined, players: FilterId[], actions: LogEntry['action'][], options: LogOptions) => 
  !entry || (
    actions.includes(entry.action) &&
    // No player for Ban/Unban = 'other'; No player for other actions = 'game'
    players.includes(entry.playerId || (entry.action === 'ban' || entry.action === 'unban' ? "other" : "game" )) &&
    // Hide playerActions done by host
    ( !entry.playerId || !entry.byHost || !options?.hideHost || entry.action === 'ban' )
  )
