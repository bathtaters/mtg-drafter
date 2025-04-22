import type { LogAction, LogEntry } from "@prisma/client"
import type { LogOptions, LogEntryFull } from "types/game"
import type { FilterId } from "types/logs"
import { timerText } from "assets/strings"

const watcherActions: LogAction[] = ['join', 'leave', 'ban', 'unban']

export const adaptEntry = <L extends Partial<LogEntry>>(entry: L) => ({ ...entry, time: entry.time && new Date(entry.time) })


export const filterEntry = (entry: LogEntryFull | undefined, players: FilterId[], actions: LogEntry['action'][], options: LogOptions) => {
  if (!entry) return true
  if (!actions.includes(entry.action)) return false
  
  // Check PlayerID (or placeholder based on action)
  const entryPlayer = entry.playerId || (
    ['ban', 'unban'].includes(entry.action) ? "other" : "game"
  )
  if (!players.includes(entryPlayer)) return false

  // Hide player actions done by host (If hideHost is enabled)
  if (options?.hideHost && entry.playerId && entry.hostId) return false
  // Hide watcher actions (If hideWatchers is enabled)
  if (options?.hideWatchers && !entry.playerId && watcherActions.includes(entry.action)) return false
  return true
}


const endsInId = /id$/i
export const objToString = (obj?: Record<string,any>) => !obj ? "" : Object.entries(obj).filter(([key]) => !endsInId.test(key))
  .map(([key, val]) => `${key}: ${key === 'timerBase' ? timerText[val ?? 0]?.value || val : val}`).join(", ")


export const getName = ({ action, data }: LogEntryFull) => watcherActions.includes(action) ? data : undefined