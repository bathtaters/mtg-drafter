import type { Game, Player } from '@prisma/client'
import { gameUrlRegEx } from 'assets/urls'
import { getNeighborIdx } from 'components/game/shared/game.utils'

export const parseGameURL = (url: string) => (url.match(gameUrlRegEx) || [])[1]

export const getNextPlayerId = (playerId: Player['id'], game?: Pick<Game, "round"|"roundCount"> & { players: Array<{ id: Player['id'] }> }) => {
  if (!game || game.players.length <= 1) return undefined
  const playerIdx = game.players.findIndex(({ id }) => playerId === id)
  if (playerIdx === -1) return undefined
  
  return game.players[getNeighborIdx(game, game.players.length, playerIdx)]?.id
}

export const unregGameAdapter = ({ id, name, url }: Game) => ({ id, name, url })
