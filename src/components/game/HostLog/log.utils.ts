import type { LogEntry, Player } from "@prisma/client"
import type { LogFull } from "types/game"

export const additionalPlayers = ["game", "host"] as const

export type PlayerFilter = typeof additionalPlayers[number] | Player['id']


export const filterLogs = (logs?: LogFull, players?: PlayerFilter[], actions?: LogEntry['action'][]) => 
  logs && logs.filter(({ playerId, byHost, action }) => 
    (!actions || actions.includes(action)) &&
    (!players || (
      (!playerId ? players.includes(additionalPlayers[0]) : 
      players.includes(playerId) && ( !byHost || players.includes(additionalPlayers[1]) ))
    ))
  )


export function debounce<A extends [] = []>(callback: (...args: A) => void, delay = 500) {
  let timeout: NodeJS.Timeout

  return (...args: A) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}