import type { GameCard } from "@prisma/client"
import { Game, BasicPlayer, PackMin, Board, GameStatus, ServerProps } from "types/game"
import { mod } from "components/base/services/common.services"

export const canWatch = (game?: { watchers?: { sessionId?: string | null }[] }, session?: string): boolean =>
  !game?.watchers || !session ? false :
    game.watchers.some(({ sessionId }) => session === sessionId)

export const gameIsPaused = (game?: Partial<Game>): game is Game & { pause: number } => typeof game?.pause === 'number'

export const gameIsEnded = (game?: Partial<Game>): boolean =>
  typeof game?.round === 'number' && game.round > (game.roundCount || 0)

export const gameIsLocked = (id?: Game['id'], banned?: Game['banned']) => !id || !banned ? false :
  banned.some(({ gameId, sessionId }) => !sessionId && gameId === id)

export const getBoard = <C extends GameCard>(playerCards: C[], board: Board) => playerCards.filter(({ board: cardBoard }) => board === cardBoard)

export const getGameStatus = (game?: Partial<Game>): GameStatus | undefined =>
  typeof game?.round !== 'number' ? undefined :
    game.round < 1 ? GameStatus.start : gameIsEnded(game) ? GameStatus.end :
    game.round === game.roundCount ? GameStatus.last : GameStatus.active

export const getOppIdx = (playerIdx: number, playerCount: number) => {
  if (playerIdx < 0) return;
  const f = Math.floor(playerCount / 2);
  if (!f || playerIdx >= 2 * f) return;
  return (playerIdx + f) % (2 * f);
}

export const getAllIndexes = (playerIdx: number, playerCount: number) => {
  if (playerIdx < 0) return undefined
  
  const opp = getOppIdx(playerIdx, playerCount),
    prev = (playerIdx + playerCount - 1) % playerCount,
    next = (playerIdx + 1) % playerCount

  return {
    opp: playerIdx === opp ? undefined : opp,
    next: playerIdx === next ? undefined : next,
    prev: playerIdx === prev || prev  === next ? undefined : prev,
  }
}

export const passingRight = ({ round, roundCount }: Partial<Game>) =>
  typeof round !== 'number' || round < 1 || round > (roundCount || 0) ? undefined :
    round % 2 === 1

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

export const getPackIdx = (game: Pick<Game,"round"|"roundCount"> | undefined, players: Pick<BasicPlayer,"id"|"pick">[], player: Pick<BasicPlayer,"id"> | null, forcePick?: number) => {
  if (!game || game.round < 1 || game.round > game.roundCount) return -1
  
  const playerIdx = getPlayerIdx(players, player)
  if (playerIdx === -1) return -1

  if (forcePick == null) {
    // Check if pack was passed
    const neighborIdx = getNeighborIdx(game, players.length, playerIdx)
    if (neighborIdx !== -1 && players[playerIdx].pick > players[neighborIdx].pick) return -1
    // Set pick to current pack
    forcePick = players[playerIdx].pick - 1
  }

  return (game.round - 1) * players.length + mod((playerIdx + forcePick * (passingRight(game) ? -1 : 1)), players.length)
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

export const getCanAdvance = (game?: Partial<Game>, players: BasicPlayer[] = [], holding: number[] = []) =>
  game && typeof game.round === 'number' &&
    (game.round < 1 ? players.every(({ sessionId }) => sessionId) : holding.every((h) => !h))

export const getCurrentPack = ({ packs, options, player, players }: Pick<ServerProps, 'options'|'packs'|'player'|'players'>) => {
  const pack = packs?.[getPackIdx(options as Game, players ?? [], player ?? null)]
  return pack &&  ({
    ...pack, cards: pack.cards.filter(({ playerId }) => !playerId)
  })
}
