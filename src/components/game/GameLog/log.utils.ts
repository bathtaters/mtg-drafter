import type { LogAction, LogEntry } from "@prisma/client"
import type { LogOptions, LogEntryFull, BasicPlayer } from "types/game"
import type { FilterId } from "types/logs"
import { timerText } from "assets/strings"
import { ALL_WATCHERS } from "assets/constants"

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


export const getName = ({ action, data }: LogEntryFull) => !watcherActions.includes(action) ? undefined : data === ALL_WATCHERS ? "All" : data


/** Convert log entry objects into a JSON string,
 * optionally including player names if playerData is provided. */
export function stringifyLogEntries(entries: LogEntryFull[], playerData: BasicPlayer[] = []) {
  // Create Player object using IDs as keys
  const players = playerData.reduce(
    (obj, { id, name }) => ({ ...obj, [id]: { name, id } }),
    {} as Record<BasicPlayer['id'], Pick<BasicPlayer, 'id'|'name'>>
  )

  const jsonData = entries.map((entry) => JSON.stringify(stringifyLogEntry(entry, players))).join(",\n  ")
  return `[\n  ${jsonData}\n]\n`
}

const stringifyLogCard = ({ cardId: id, card: { scryfallId, name }, foil, board }: NonNullable<LogEntryFull['card']>) => ({
  name, foil, board, scryfallId, id,
})

const stringifyLogEntry = ({ action, card, data, hostId, playerId, sessionId, time }: LogEntryFull, players: Record<string, Pick<BasicPlayer,"id"|"name">>) => ({
  time,
  action,
  player: playerId ? players[playerId] || playerId : null,
  card: card && stringifyLogCard(card),
  data: action === 'settings' ? data && JSON.parse(data) : data,
  hostId,
  sessionId,
})