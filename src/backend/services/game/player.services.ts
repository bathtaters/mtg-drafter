import type { GameCard, Player, Board } from '@prisma/client'
import type { BasicLands } from '../../../types/definitions'
import prisma from '../../libs/db'

export async function getPlayer(sessionId: Player['sessionId'], playerList: Player[]) {
  const playerIdx = playerList ? playerList.findIndex(({ sessionId: sid }) => sessionId === sid) : -1
  if (!playerList[playerIdx]?.id) return { playerIdx }

  const player = await prisma.player.findUnique({
    where: { id: playerList[playerIdx].id },
    include: {
      cards: { include: { card: { include: { otherFaces: true } } } },
    }
  })
  return { player, playerIdx }
}

export function renamePlayer(id: Player['id'], newName: Player['name']) {
  return prisma.player.update({ where: { id }, data: { name: newName }})
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