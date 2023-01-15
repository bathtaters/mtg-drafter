import type { Game } from '@prisma/client'
import type { Player } from 'types/game'
import { gameUrlRegEx } from 'assets/urls'
import { getNeighborIdx } from 'components/game/shared/game.utils'
import { defaultTimer, setupDefaults, timerOptions } from 'assets/constants'

export const parseGameURL = (url: string) => (url.match(gameUrlRegEx) || [])[1]

export const getNextPlayerId = (playerId: Player['id'], game?: Pick<Game, "round"|"roundCount"> & { players: Array<{ id: Player['id'] }> }) => {
  if (!game || game.players.length <= 1) return undefined
  const playerIdx = game.players.findIndex(({ id }) => playerId === id)
  if (playerIdx === -1) return undefined
  
  return game.players[getNeighborIdx(game, game.players.length, playerIdx)]?.id
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