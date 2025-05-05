import type { Game, LogEntryFull, Player } from 'types/game'
import prisma from '../../libs/db'

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
export async function getName(sessionId: Player['sessionId'], gameId: Game['id'] | null = null, playerId: Player['id'] | null = null) {
  
    // Priority 1 -- Use PlayerID
    if (playerId) {
      const player = await prisma.player.findUnique({
        where: { id: playerId, name: { not: null } },
        select: { name: true },
      })
      if (player?.name) return player.name
    }
    if (!sessionId) return null

    // Batch fetch -- Priorities 2-5
    const [ player, ban, gamePlayer, gameBan ] = await prisma.$transaction([
      // Priority 4 -- Player from most recent game
      prisma.player.findFirst({
        where: { sessionId, name: { not: null } },
        select: { name: true },
      }),
      // Priority 5 -- Ban from most recent game
      prisma.ban.findFirst({
        where: { sessionId, name: { not: null } },
        select: { name: true },
      }),
      ...(!gameId ? [] : [
        // Priority 2 -- Current/Former player from this game
        prisma.player.findFirst({
          where: { gameId, sessionId, name: { not: null } },
          select: { name: true },
        }),
        // Priority 3 -- Previous ban from this game
        prisma.ban.findFirst({
          where: { gameId, sessionId, name: { not: null } },
          select: { name: true },
        })
      ])
    ])
    
    // Batch respond -- Priorities 2-5
    if (gamePlayer?.name) return gamePlayer.name
    if (gameBan?.name) return gameBan.name
    if (player?.name) return player.name
    if (ban?.name) return ban.name

    // Batch fetch = Priorities 6-9
    const [ banLogs, joinLogs, gameBanLogs, gameJoinLogs ] = await prisma.$transaction([
      // Priority 7 -- Join/rename/leave/ban/unban from most recent game
      prisma.logEntry.findFirst({
        where: { sessionId, action: { in: ['ban', 'unban', 'join', 'rename', 'leave'] }, data: { not: null } },
        select: { data: true },
        orderBy: { time: 'desc' },
      }),
      // Priority 9  -- Get name using PlayerId in Log from most recent game
      prisma.logEntry.findFirst({
        where: { sessionId, action: { in: ['join', 'leave'] }, playerId: { not: null } },
        select: { action: true, time: true, player: { select: { id: true, name: true } } },
        orderBy: { time: 'desc' },
      }),
      // Priority 6 -- Join/rename/leave/ban/unban from current game
      ...(!gameId ? [] : [
        prisma.logEntry.findFirst({
          where: { gameId, sessionId, action: { in: ['ban', 'unban', 'join', 'rename', 'leave'] }, data: { not: null } },
          select: { data: true },
          orderBy: { time: 'desc' },
        }),
        // Priority 8  -- Get name using PlayerId in Log from current game
        prisma.logEntry.findFirst({
          where: { gameId, sessionId, action: { in: ['join', 'leave'] }, playerId: { not: null } },
          select: { action: true, time: true, player: { select: { id: true, name: true } } },
          orderBy: { time: 'desc' },
        })
      ])
    ])
    
    // Batch respond -- Priorities 6-7
    if ((gameBanLogs as LogEntryFull)?.data) return (gameBanLogs as LogEntryFull).data
    if (banLogs?.data) return banLogs.data

    // Batch respond -- Priorities 8-9
    const logEntry = gameJoinLogs && 'player' in gameJoinLogs && gameJoinLogs.player?.id ? gameJoinLogs : joinLogs
    
    if (logEntry?.player?.id) {  
      // If last action was a 'join', use the current name
      if (logEntry.action === 'join' && logEntry.player.name) return logEntry.player.name

      // Otherwise find the last rename before leaving
      const renameEntry = await prisma.logEntry.findFirst({
        where: {
          playerId,
          action: 'rename',
          data: { not: null },
          // If log entry was for them leaving, only search before the log entry
          time: logEntry.action === 'leave' ? { lte: logEntry.time } : { gte: logEntry.time }
        },
        select: { data: true },
        orderBy: { time: 'desc' },
      })
      if (renameEntry?.data) return renameEntry.data
    }
    
    // Final attempt = Player name from entry, or NULL
    return logEntry?.player?.name || null
  }

export const getLastJoinSession = (sessionId: Player['sessionId'], gameId: Game['id']) => prisma.logEntry.findFirst({
  where: { gameId, sessionId, action: 'join' },
  select: { gameId: true, data: true },
  orderBy: { time: 'desc' },
}).then((entry) => entry?.data || null)

export const getLastBan = (sessionId: Player['sessionId'], gameId: Game['id']) => prisma.logEntry.findFirst({
  where: { gameId, sessionId, action: 'ban' },
  select: { gameId: true, playerId: true, data: true },
  orderBy: { time: 'desc' },
})