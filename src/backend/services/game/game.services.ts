import type { Game, GameCard, Player, Board } from '@prisma/client'
import { getNextPlayerId } from '../../utils/game/game.utils'
import prisma from '../../libs/db'

export function getGame(url: Game['url']) {
  return prisma.game.findUnique({
    where: { url },
    include: {
      players: true, packs: {
        orderBy: { index: 'asc' }, include: {
          cards: { 
            where: { playerId: null },
            include: {
              card: { include: { otherFaces: true } }
            }
          }
        }
      }
    }
  })
}

export function renameGame(id: Game['id'], newName: Game['name']) {
  return prisma.game.update({ where: { id }, data: { name: newName }, select: { name: true } })
    .then(({ name }) => name)
}

export function nextRound(id: Game['id'], round: Game['round']) {
  return prisma.game.update({
    where: { id },
    data: {
      round: round,
      players: { updateMany: {
        where: {}, data: { pick: 1 },
      }},
    },
    select: { round: true }
  }).then(({ round }) => round)
}

export async function pickCard(playerId: Player['id'], gameCardId: GameCard['id'], board: Board = "main") {
  const unPicked = await prisma.gameCard.count({ where: { id: gameCardId, playerId: null }})
  if (!unPicked) return undefined
  
  const [ player ] = await prisma.$transaction([
    prisma.player.update({
      where: { id: playerId },
      data: { pick: { increment: 1 } },
      select: { id: true, pick: true, gameId: true },
    }),
    prisma.gameCard.update({
      where: { id: gameCardId },
      data: { playerId, board },
    }),
  ])

  const game = await prisma.game.findUnique({
    where: { id: player.gameId },
    select: { round: true, roundCount: true, players: { select: { id: true } } },
  })
  if (!game) return console.error('Error picking card: Card pick registered, but game not found')

  return { ...player, passingToId: getNextPlayerId(playerId, game) }
}

export async function gameExists(gameUrl: string | string[] | undefined) {
  if (!gameUrl || typeof gameUrl !== 'string') {
    console.error(`Fetch game/player: Invalid gameURL (${gameUrl})`)
    return false
  }
  const gameExists = await prisma.game.count({ where: { url: gameUrl } })
  if (!gameExists) console.error(`Fetch game: GameURL not found (${gameUrl})`)
  return !!gameExists
}