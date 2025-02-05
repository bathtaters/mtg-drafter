import type { LogEntry } from "@prisma/client"
import type { LogOptions, LogEntryFull } from "types/game"
import type { FilterId } from "types/logs"


export const adaptEntry = <L extends Partial<LogEntry>>(entry: L) => ({ ...entry, time: entry.time && new Date(entry.time) })


export const filterEntry = (entry: LogEntryFull | undefined, players: FilterId[], actions: LogEntry['action'][], options: LogOptions) => 
  !entry || (
    actions.includes(entry.action) &&
    // No player for Ban/Unban = 'other'; No player for other actions = 'game'
    players.includes(entry.playerId || (entry.action === 'ban' || entry.action === 'unban' ? "other" : "game" )) &&
    // Hide playerActions done by host
    ( !entry.playerId || !entry.byHost || !options?.hideHost || entry.action === 'ban' )
  )
