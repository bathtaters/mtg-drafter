import type { Game, GameCard, Board } from '@prisma/client'
import type { Player } from 'types/game'
import prisma from '../../libs/db'
import retry from '../../libs/retry'
import { getNextPlayerId } from '../../utils/game/game.utils'

const basicPlayer /* Prisma.Game$playersArgs */ = { select: { id: true, name: true, sessionId: true, pick: true } }


export function getGame(url: Game['url'], includePacks = true) {
  return prisma.game.findUnique({
    where: { url },
    include: {
      players: basicPlayer,
      packs: includePacks && {
        orderBy: { index: 'asc' }, include: {
          cards: { 
            where: { playerId: null },
            include: {
              card: { include: { otherFaces: { include: { card: true } } } }
            }
          }
        }
      }
    }
  })
}


export function getGameLog(url: Game['url']) {
  return prisma.game.findUnique({
    where: { url },
    include: {
      players: basicPlayer,
      log: {
        orderBy: { time: 'desc' },
        include: { card: { include: { card: true } } }
      }
    }
  })
}


export function renameGame(id: Game['id'], newName: Game['name']) {
  return retry(() => prisma.$transaction([
    prisma.game.update({ where: { id }, data: { name: newName }, select: { name: true } }),

    prisma.logEntry.create({ data: { gameId: id, byHost: true, action: 'settings', data: JSON.stringify({ name: newName }) } })
  ])).then(([{ name }]) => name)
}


export async function nextRound(id: Game['id'], round: Game['round']) {
  const game = await retry(() => prisma.game.update({
    where: { id },
    data: {
      round: round,
      players: { updateMany: {
        where: {}, data: { pick: 1 },
      }},
    },
    select: { round: true, roundCount: true }
  }))
  if (!game) throw new Error('Game not found')

  await retry(() => prisma.logEntry.create({ data: {
    gameId: id, byHost: true, action: 'round',
    data: `${game.round > game.roundCount ? 'END' : game.round}`
  } }))

  return game.round
}


export async function pickCard(playerId: Player['id'], gameCardId: GameCard['id'], board: Board = "main") {
  if (!(await prisma.player.count({ where: { id: playerId }}))) return 'Player'

  let game: Pick<Game,"id"|"round"|"roundCount"> & { players: { id: Player['id'] }[] },
    player: Pick<Player,"id"|"gameId"|"pick">

  try {
    const txRes = await retry(() => prisma.$transaction([
      prisma.gameCard.findFirstOrThrow({
        where: { id: gameCardId, playerId: null },
        select: { pack: { select: {
          game: { select: {
            id: true,
            round: true,
            roundCount: true,
            players: { select: { id: true } }
          }}
        }}}
      }),
      prisma.player.update({
        where: { id: playerId },
        data: { pick: { increment: 1 }, timer: null },
        select: { id: true, pick: true, gameId: true },
      }),
      prisma.gameCard.update({
        where: { id: gameCardId },
        data: { playerId, board },
      }),
    ]))

    game = txRes[0].pack.game
    player = txRes[1]

  } catch (err: any) {
    // P2025 = GameCard not found
    if (err.code = 'P2025') return 'Card'
    throw err
  }
  
  await retry(() => prisma.logEntry.create({ data: {
    gameId: game.id,
    playerId,
    cardId: gameCardId,
    action: 'pick',
    data: `${game.round}:${player.pick - 1}`
  } }))

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