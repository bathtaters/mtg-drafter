import type { Game, GameCard, Board, GameStatus } from "@prisma/client"
import type { BasicPlayer, PackMin, ServerProps } from "types/game"
import { mod } from "components/base/services/common.services"

export const gameIsEnded = (game?: Partial<Game>): boolean =>
  typeof game?.round === 'number' && game.round > (game.roundCount || 0)

export const getBoard = <C extends GameCard>(playerCards: C[], board: Board) => playerCards.filter(({ board: cardBoard }) => board === cardBoard)

export const getGameStatus = (game?: Partial<Game>): GameStatus | undefined =>
  typeof game?.round !== 'number' ? undefined :
    game.round < 1 ? 'start' : gameIsEnded(game) ? 'end' :
    game.round === game.roundCount ? 'last' : 'active'

export const getOppIdx = (playerIdx: number, playerCount: number) => {
  const f = Math.floor(playerCount / 2);
  if (!f || playerIdx >= 2 * f) return;
  return (playerIdx + f) % (2 * f);
}

export const passingRight = ({ round, roundCount }: Partial<Game>) =>
  typeof round !== 'number' || round < 1 || round > (roundCount || 0) ? undefined :
    round % 2 === 0

export const getPlayerIdx = (players: Pick<BasicPlayer,"id">[], player?: Pick<BasicPlayer,"id"> | null) => !player?.id ? -1 :
  players.findIndex(({ id }) => id === player.id)

export const getNeighborIdx = (game: Partial<Game> | undefined, playerCount: number, playerIdx: number, invert = false) => {
  if (!game || playerIdx === -1 || playerCount <= 1) return -1
  
  const passRight = passingRight(game)
  if (typeof passRight !== 'boolean') return -1

  return passRight !== invert ?
    mod(playerIdx - 1, playerCount) :
    (playerIdx + 1) % playerCount
}

export const getPackIdx = (game: Pick<Game,"round"|"roundCount"> | undefined, players: Pick<BasicPlayer,"id"|"pick">[], player: Pick<BasicPlayer,"id"> | null) => {
  if (!game || game.round < 1 || game.round > game.roundCount) return -1
  
  const playerIdx = getPlayerIdx(players, player)
  if (playerIdx === -1) return -1

  const neighborIdx = getNeighborIdx(game, players.length, playerIdx)
  if (neighborIdx !== -1 && players[playerIdx].pick > players[neighborIdx].pick) return -1

  return (game.round - 1) * players.length + mod(
    (playerIdx + (players[playerIdx].pick - 1) * (passingRight(game) ? -1 : 1)),
    players.length
  )
}

export const getRoundPackSize = (packs: PackMin[], playerCount: number, game?: Partial<Game>) => {
  if (!game || typeof game.round !== 'number' || !packs.length) return 0

  let packSize = 0, offset = (game.round - 1) * playerCount
  for (let i = 0; i < playerCount; i++) {
    if (packs[offset + i]?.cards.length || 0 > packSize) packSize = packs[offset + i].cards.length
  }
  return packSize
}

export const getHolding = (players: Pick<BasicPlayer,"pick">[], packSize: number, game?: Partial<Game>) =>
  !game || !players.length || typeof game.round !== 'number' ? [] :
    players.map(({ pick }, i) => {
      if (!pick || pick > packSize) return 0
      if (players.length === 1) return 1

      const neighborPick = players[getNeighborIdx(game, players.length, i)]?.pick
      if (typeof neighborPick !== 'number') return 0

      return Math.min(neighborPick, packSize) - pick + 1
    })

export const getSlots = (players?: BasicPlayer[]) => players ? players.filter(({ sessionId }) => !sessionId).map(({ id }) => id) : []

export const playerIsHost = (player?: Partial<BasicPlayer>, game?: Partial<Game>): game is Game => game?.hostId ? game.hostId === player?.id : false

export const getCanAdvance = (game?: Partial<Game>, players: BasicPlayer[] = [], holding: number[] = []) =>
  game && typeof game.round === 'number' &&
    (game.round < 1 ? players.every(({ sessionId }) => sessionId) : holding.every((h) => !h))

export const getCurrentPack = ({ packs, options, player, players }: ServerProps) => {
  const pack = packs?.[getPackIdx(options, players, player)]
  return pack &&  ({
    ...pack, cards: pack.cards.filter(({ playerId }) => !playerId)
  })
}
