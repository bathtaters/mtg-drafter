import type { Game, Player as DbPlayer } from '@prisma/client'
import type { BasicPlayer, Player } from 'types/game'
import { gameUrlRegEx } from 'assets/urls'
import { getNeighborIdx } from 'components/game/shared/game.utils'
import { defaultTimer, setupDefaults, timerOptions } from 'assets/constants'

export const adaptDbPlayer = <P extends DbPlayer>(player?: P | null) => player ? ({
  ...player,
  timer: typeof player.timer === 'bigint' ? Number(player.timer) : player.timer
}) : null

export const parseGameURL = (url: string) => (url.match(gameUrlRegEx) || [])[1]

export const getNextPlayerId = (playerId: Player['id'], game?: Pick<Game, "round"|"roundCount"> & { players: Array<{ id: Player['id'] }> }) => {
  if (!game || game.players.length <= 1) return undefined
  const playerIdx = game.players.findIndex(({ id }) => playerId === id)
  if (playerIdx === -1) return undefined
  
  return game.players[getNeighborIdx(game, game.players.length, playerIdx)]?.id
}

export const hasPack = (game: Pick<Game,"round"|"roundCount"|"packSize">, players: Pick<BasicPlayer,"id"|"pick">[], playerIdx: number) => {
  if (!game || !players[playerIdx]?.pick || game.round < 1 || game.round > game.roundCount || players[playerIdx].pick > game.packSize) return false

  const neighborIdx = getNeighborIdx(game, players.length, playerIdx)
  return neighborIdx === -1 || players[playerIdx].pick <= players[neighborIdx].pick
}

export const unregGameAdapter = ({ id, name, url }: Pick<Game,"id"|"name"|"url">) => ({ id, name, url })

const defaultTimerBase = +setupDefaults.timer
export function getTimerLength(cardCount: number, timerBase: number) {
  if (timerBase === defaultTimerBase && cardCount === 11) return 25 // Fix for official rules

  const { secPerCard, minSec, maxSec, secOffset = 0, roundTo } = timerOptions[timerBase] ? 
    { ...defaultTimer, ...timerOptions[timerBase] } : defaultTimer

  const timer = cardCount * secPerCard + secOffset
  if (typeof minSec === 'number' && timer < minSec) return minSec
  if (typeof maxSec === 'number' && timer > maxSec) return maxSec
  return roundTo ? Math.round(timer / roundTo) * roundTo : timer
}