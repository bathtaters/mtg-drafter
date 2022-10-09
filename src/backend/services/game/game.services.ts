import type { Game, GameCard, Player, Board, Pack } from '@prisma/client'
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
  return prisma.game.update({ where: { id }, data: { name: newName } })
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
  const notPicked = await prisma.gameCard.count({ where: { id: gameCardId, playerId: null }})
  if (!notPicked) return undefined
  
  const [ player ] = await prisma.$transaction([
    prisma.player.update({
      where: { id: playerId },
      data: { pick: { increment: 1 } },
      select: { pick: true },
    }),
    prisma.gameCard.update({
      where: { id: gameCardId },
      data: { playerId, board },
    }),
  ])
  return player.pick
}

export async function getPack(packId: Pack['id']) {
  return prisma.gameCard.findMany({
    where: { packId, playerId: null },
    select: { id: true },
  }).then((cards) => cards.map(({ id }) => id))
}

export async function getGameAndPlayer(gameUrl: string | string[] | undefined, sessionId: string) {
  if (!gameUrl || typeof gameUrl !== 'string') {
    console.error(`Fetch game/player: Invalid gameURL (${gameUrl})`)
    return null
  }

  const gameId = await prisma.game.findUnique({ where: { url: gameUrl }, select: { id: true } })
    .then((game) => game?.id)

  if (!gameId) {
    console.error(`Fetch game/player: GameURL not found (${gameUrl})`)
    return null
  }

  const playerId = await prisma.player.findUnique({
    where: { sessionId_gameId: { sessionId, gameId } },
    select: { id: true }
  }).then((player) => player?.id)

  if (!playerId) {
    console.error(`Fetch game/player: SessionID not found (${sessionId})`)
    return null
  }

  return { gameId, playerId, gameUrl, sessionId }
}