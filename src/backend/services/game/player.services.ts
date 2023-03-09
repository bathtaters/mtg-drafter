import type { GameCard, Board } from '@prisma/client'
import type { Game, BasicLands, Player, BasicPlayer } from 'types/game'
import prisma from '../../libs/db'
import retry from '../../libs/retry'
import { getTimerLength, adaptDbPlayer, hasPack } from 'backend/utils/game/game.utils'

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