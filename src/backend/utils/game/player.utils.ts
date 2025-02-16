import type { Game, Player } from 'types/game'
import prisma from '../../libs/db'
import { getSessionData } from 'components/game/shared/player.utils'
import { LOG_DELIM } from 'assets/constants'

/** Lookup a player's name based on a `sessionId`, `gameId` and/or `playerId`.
 *  In order of priority...
 *  1. Player.name via `playerId` *(Skips if no `playerId`, assumes current player name)*
 *  2. Player.name via `sessionId` & `gameId` *(Skips if no `gameId`)*
 *  3. Ban.name via `sessionId` & `gameId` *(Skips if no `gameId`)*
 *  4. Player.name from any game via `sessionId`
 *  5. Ban.name from any game via `sessionId`
 *  6. Latest ban logEntry.data via `sessionId` & `gameId` *(Skips if no `gameId`)*
 *  7. Latest ban logEntry.data from any game via `sessionId`
 *  8. Latest rename logEntry.data via `sessionId` => `playerId` & `gameId`
 *  9. Latest rename logEntry.data from any game via `sessionId` => `playerId`
*/
export async function getName(sessionId: Player['sessionId'], game: Game['id'] | null = null, playerId: Player['id'] | null = null) {
  
    // Priority 1
    if (playerId) {
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        select: { name: true },
      })
      if (player?.name) return player.name
    }
    if (!sessionId) return null
  
  
    // Priority 2
    const players = await prisma.player.findMany({
      where: { sessionId },
      select: { gameId: true, name: true },
    })

    // Short-circuit to Priority 4 if no gameId
    if (!game && players[0]?.name) return players[0].name

    const playersGame = game ? players.find(({ gameId }) => gameId === game) : null
    if (playersGame?.name) return playersGame.name
    
    // Priority 3
    const bans = await prisma.ban.findMany({
      where: { sessionId },
      select: { gameId: true, name: true },
    })
    const bansGame = game ? bans.find(({ gameId }) => gameId === game) : null
    if (bansGame?.name) return bansGame.name
  
    // Priorities 4 & 5
    if (players[0]?.name) return players[0].name
    if (bans[0]?.name) return bans[0].name
    
    // Priorities 6 & 7
    const banLogs = await prisma.logEntry.findMany({
      where: { action: { in: ['ban', 'unban', 'join', 'leave'] }, data: { startsWith: `${sessionId}${LOG_DELIM}` } },
      select: { gameId: true, data: true },
      orderBy: { time: 'desc' },
    })
  
    // Use game or latest entry if no game found
    const banLogEntry = (game && banLogs.find(({ gameId }) => gameId === game)) || banLogs[0]
    if (banLogEntry?.data) {
      const banName = getSessionData(banLogEntry.data)[0]
      if (banName) return banName
    }
    
    // Priorities 8 & 9
    const logs = await prisma.logEntry.findMany({
      where: { action: { in: ['join', 'leave'] }, data: sessionId },
      include: { player: { select: { id: true, name: true } } },
      orderBy: { time: 'desc' },
    })
  
    // Use game or latest entry if no game found
    const logEntry = (game && logs.find(({ gameId }) => gameId === game)) || logs[0]

    if (logEntry?.player?.id) {  
      const lastRename = await prisma.logEntry.findFirst({
        where: {
          playerId,
          action: 'rename',
          // If log entry was for them leaving, only search before the log entry
          time: logEntry.action === 'leave' ? { lte: logEntry.time } : logEntry.time
        },
        select: { data: true },
        orderBy: { time: 'desc' },
      })
      if (lastRename?.data) return lastRename.data
      // If no rename history, use current player name
      if (logEntry?.player?.name) return logEntry.player.name
    }
  
    return null
  }

export const getLastJoinSession = (sessionId: Player['sessionId'], gameId: Game['id']) => prisma.logEntry.findMany({
  where: { gameId, action: 'join', data: { startsWith: `${sessionId}${LOG_DELIM}` } },
  select: { gameId: true, data: true },
  orderBy: { time: 'desc' },
  take: 1,
}).then((entries) => entries?.[0]?.data || null)
