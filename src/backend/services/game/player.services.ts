import type { GameCard, Board, Ban } from '@prisma/client'
import type { Game, BasicLands, Player, BasicPlayer } from 'types/game'
import prisma from '../../libs/db'
import retry from '../../libs/retry'
import { getTimerLength, adaptDbPlayer, hasPack } from 'backend/utils/game/game.utils'
import { getName } from 'backend/utils/game/player.utils'
import { BOT, LOG_DELIM } from 'assets/constants'

const fullPlayer /* Prisma.PlayerInclude */ = {
  cards: { include: { card: { include: { otherFaces: { include: { card: true } } } } } }
}


export async function getPlayer(sessionId: Player['sessionId'], playerList: BasicPlayer[], game: Game, packSize: number, startTime?: number) {
  const playerIdx = playerList.findIndex(({ sessionId: sid }) => sessionId === sid)
  if (playerIdx === -1) return null

  const player = await prisma.player.findUnique({ where: { id: playerList[playerIdx].id }, include: fullPlayer })
  if (!player || !game.timerBase || game.round > game.roundCount) return adaptDbPlayer(player)
  
  const isPicking = hasPack(game, playerList, playerIdx, packSize)
  if (isPicking && player.timer !== null) return adaptDbPlayer(player)

  const timer = isPicking ? (startTime ?? Date.now()) + getTimerLength(packSize - player.pick + 1, game.timerBase) * 1000 : null

  if (timer !== null || player.timer) await retry(() => prisma.player.update({ where: { id: player.id }, data: { timer } }))
  return { ...player, timer }
}


export async function setStatus(id: Player['id'], sessionId: Player['sessionId'] = null, byHost: boolean = false) {
  const player = await retry(() => prisma.player.update({ where: { id }, data: { sessionId } }))

  await retry(() => prisma.logEntry.create({ data: {
    gameId: player.gameId,
    playerId: id,
    byHost,
    action: sessionId ? 'join' : 'leave',
    data: sessionId,
  } }))

  return adaptDbPlayer(player)
}


export async function banPlayer(gameId: Game['id'], sessionId: Player['sessionId'] = null, unban: boolean = false, playerId: Player['id'] | null = null) {

  const name = await getName(sessionId, gameId, playerId)

  if (!unban && sessionId) {
    // Drop player/watcher
    await retry(() => prisma.$transaction([
      prisma.watcher.deleteMany({ where: { gameId, sessionId } }),
      prisma.player.updateMany({
        where: { gameId, sessionId },
        data: { sessionId: null },
      }),
    ]))
  }

  const ban: Partial<Ban & { unban: number }> = await retry(() => !unban ? 
    prisma.ban.create({ data: { gameId, sessionId, name } }) :
    prisma.ban.deleteMany({ where: { gameId, sessionId } })
      .then(({ count }) => ({ unban: count }))
  )

  await retry(() => prisma.logEntry.create({ data: {
    gameId,
    playerId,
    byHost: true,
    action: unban ? 'unban' : 'ban',
    data: sessionId ? `${sessionId}${LOG_DELIM}${name || ''}` : null,
  } }))

  if (unban && ban.unban !== 1) console.warn(`Unban resulted in unbanning ${ban.unban} rows (Expected: 1).`)
  return { gameId, playerId, sessionId, name, ...ban, unban: Boolean(ban.unban) }
}


export async function renamePlayer(id: Player['id'], newName: Player['name'], byHost: boolean = false) {
  const player = await retry(() => prisma.player.update({ where: { id }, data: { name: newName }, select: { id: true, name: true, gameId: true }}))

  await retry(() => prisma.logEntry.create({ data: { gameId: player.gameId, playerId: id, byHost, action: 'rename', data: newName } }))

  return player
}


export function updateLands(id: Player['id'], lands: BasicLands) {
  return retry(() => prisma.player.update({ where: { id }, data: { basics: lands }, select: { basics: true }}))
    .then(({ basics }) => basics as BasicLands)
}


export function swapCard(gameCardId: GameCard['id'], toBoard: Board) {
  return retry(() => prisma.gameCard.update({
    where: { id: gameCardId },
    data: { board: toBoard },
    select: { id: true, board: true },
  }))
}

export const getBots = (gameId: Game['id']) => prisma.player.findMany({
  where: { gameId, sessionId: BOT },
  include: fullPlayer,
})