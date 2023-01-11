import type { GameCard, Player as DbPlayer, Board } from '@prisma/client'
import type { BasicLands, Player, BasicPlayer } from 'types/game'
import prisma from '../../libs/db'
import { getTimerLength } from 'backend/utils/game/game.utils'

export const fixed = <P extends DbPlayer>(player?: P | null) => player && ({ ...player, timer: typeof player.timer === 'bigint' ? Number(player.timer) : player.timer })

const fullPlayer /* Prisma.PlayerInclude */ = {
  cards: { include: { card: { include: { otherFaces: { include: { card: true } } } } } }
}

export async function getPlayer(sessionId: Player['sessionId'], playerList: BasicPlayer[], cardCount?: number, startTime?: number) {
  const id = playerList.find(({ sessionId: sid }) => sessionId === sid)?.id
  if (!id) return null

  const player = await prisma.player.findUnique({ where: { id }, include: fullPlayer })
  if (!player || typeof cardCount !== 'number') return fixed(player)
  
  const isActive = !!player?.pick && player.pick <= cardCount
  if (isActive && player.timer !== null) return fixed(player)

  const timer = isActive ? (startTime ?? Date.now()) + getTimerLength(cardCount - player.pick + 1) * 1000 : null

  if (timer !== null || player.timer) await prisma.player.update({ where: { id }, data: { timer } })
  return { ...player, timer }
}

export async function setStatus(id: Player['id'], sessionId: Player['sessionId'] = null, byHost: boolean = false) {
  const player = await prisma.player.update({
    where: { id }, data: { sessionId },
    include: { cards: !!sessionId && fullPlayer.cards }
  })
  await prisma.logEntry.create({ data: {
    gameId: player.gameId,
    playerId: id,
    byHost,
    action: sessionId ? 'join' : 'leave',
    data: sessionId,
  } })
  return fixed(player)
}

export async function renamePlayer(id: Player['id'], newName: Player['name'], byHost: boolean = false) {
  const player = await prisma.player.update({ where: { id }, data: { name: newName }, select: { id: true, name: true, gameId: true }})
  await prisma.logEntry.create({ data: { gameId: player.gameId, playerId: id, byHost, action: 'rename', data: newName } })
  return player
}

export function updateLands(id: Player['id'], lands: BasicLands) {
  return prisma.player.update({ where: { id }, data: { basics: lands }, select: { basics: true }})
    .then(({ basics }) => basics as BasicLands)
}

export function swapCard(gameCardId: GameCard['id'], toBoard: Board) {
  return prisma.gameCard.update({
    where: { id: gameCardId },
    data: { board: toBoard },
    select: { id: true, board: true },
  })
}