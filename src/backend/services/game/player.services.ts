import type { GameCard, Player, Board } from '@prisma/client'
import type { BasicLands } from 'types/game'
import prisma from '../../libs/db'

export async function getPlayer(sessionId: Player['sessionId'], playerList: Player[]) {
  const id = playerList.find(({ sessionId: sid }) => sessionId === sid)?.id
  if (!id) return null

  return prisma.player.findUnique({
    where: { id }, include: {
      cards: { include: { card: { include: { otherFaces: true } } } },
    }
  })
}

export function setStatus(id: Player['id'], sessionId: Player['sessionId'] = null) {
  return prisma.player.update({
    where: { id }, data: { sessionId },
    include: {
      cards: !!sessionId && { include: { card: { include: { otherFaces: true } } } },
    }
  })
}

export function renamePlayer(id: Player['id'], newName: Player['name']) {
  return prisma.player.update({ where: { id }, data: { name: newName }, select: { id: true, name: true }})
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