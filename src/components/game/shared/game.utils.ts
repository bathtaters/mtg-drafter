import type { Game, GameCard, Player } from "@prisma/client"
import type { PackFull } from "types/game"

export const getRound = ({ round, roundCount }: { round: number, roundCount: number }) =>
  round > roundCount ? 'Finished' : round <= 0 ? 'Awaiting' : 
    `Pack ${round} of ${roundCount}`

export const getOppIdx = (playerIdx: number, playerCount: number) => {
  const f = Math.floor(playerCount / 2);
  if (!f || playerIdx >= 2 * f) return;
  return (playerIdx + f) % (2 * f);
}

export const passingUp = ({ round, roundCount }: { round: number, roundCount: number }) =>
  round < 1 || round > roundCount ? undefined :
    round % 2 === 0

export const getPlayerIdx = (players: Player[], player?: Player | null) => !player?.id ? -1 : players.findIndex(({ id }) => id === player.id)

export const getNeighborIdx = (game: Game | undefined, playerCount: number, playerIdx: number) =>
  !game || playerIdx === -1 || playerCount <= 1 ? -1 : passingUp(game) ?
    (playerIdx - 1 + playerCount) % playerCount :
    (playerIdx + 1) % playerCount

export const getPackIdx = (game: Game | undefined, players: Player[], playerIdx: number, neighborIdx: number, offset: number = 0) => {
  if (!game || game.round < 1 || game.round > game.roundCount || playerIdx === -1) return -1
  if (neighborIdx !== -1 && players[playerIdx].pick > players[neighborIdx].pick) return -1
  return (game.round - 1) * players.length + (playerIdx + players[playerIdx].pick + offset) % players.length
}

export const getHolding = (game: Game | undefined, players: Player[]) => !game || !players.length ? [] :
  players.map(({ pick }, i) =>
    !pick || !game || pick > game.packSize ? 0 : players.length === 1 ? 1 :
    players[getNeighborIdx(game, players.length, i)].pick - pick + 1
  )

export const filterPackIds = (pack: PackFull, ids: GameCard['id'][]): PackFull => ({
  ...pack, cards: pack.cards.filter(({ id }) => ids.includes(id))
})