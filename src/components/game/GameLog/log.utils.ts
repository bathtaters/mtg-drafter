import type { LogEntry } from "@prisma/client"
import type { LogOptions, LogEntryFull } from "types/game"
import type { FilterId } from "types/logs"
import { getSessionData } from "../shared/player.utils"
import { timerText } from "assets/strings"


export const adaptEntry = <L extends Partial<LogEntry>>(entry: L) => ({ ...entry, time: entry.time && new Date(entry.time) })


export const filterEntry = (entry: LogEntryFull | undefined, players: FilterId[], actions: LogEntry['action'][], options: LogOptions) => 
  !entry || (
    actions.includes(entry.action) &&
    // No player for Ban/Unban = 'other'; No player for other actions = 'game'
    players.includes(entry.playerId || (entry.action === 'ban' || entry.action === 'unban' ? "other" : "game" )) &&
    // Hide playerActions done by host
    ( !entry.playerId || !entry.byHost || !options?.hideHost || entry.action === 'ban' )
  )


const endsInId = /id$/i
export const objToString = (obj?: Record<string,any>) => !obj ? "" : Object.entries(obj).filter(([key]) => !endsInId.test(key))
  .map(([key, val]) => `${key}: ${key === 'timerBase' ? timerText[val ?? 0]?.value || val : val}`).join(", ")


export function getSession(entry: LogEntryFull) {
  if (!entry.data || !['ban', 'unban', 'join', 'leave'].includes(entry.action)) return null
  
  const [ id, name ] = getSessionData(entry.data)
  if (!id) return null
  return { id, name }
}