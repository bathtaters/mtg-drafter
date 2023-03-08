import type { Merge } from 'types/global.d'
import type { Game as DbGame, Player as DbPlayer } from '@prisma/client'
import type { Game, BasicPlayer, Player } from 'types/game'
import { gameUrlRegEx } from 'assets/urls'
import { getNeighborIdx } from 'components/game/shared/game.utils'
import { defaultTimer, setupDefaults, timerOptions } from 'assets/constants'

export const getMaxPackSize = (packCounts: { packIdx: number, _count: number }[], round: number, roundCount: number, playerCount: number) => {
  if (!round || !roundCount || !playerCount || round > roundCount) return 0
  const rangeEnd = round * playerCount

  let maxPackSize = 0
  for (let pack = rangeEnd - playerCount; pack < rangeEnd; pack++) {
    if (packCounts[pack]?.packIdx !== pack) throw new Error(`Pack ${pack} is missing!`)

    if (packCounts[pack]._count > maxPackSize)
      maxPackSize = packCounts[pack]._count
  }
  return maxPackSize
}

export const adaptDbGame = <G extends Partial<DbGame>>(game?: G | null) => (
  !game || typeof game.pause !== 'bigint' ? game : {
    ...game,
    pause: Number(game.pause)
  }
) as Merge<G, Game> | null | undefined

export const adaptDbPlayer = <P extends Partial<DbPlayer>>(player?: P | null) => (
  !player || typeof player.timer !== 'bigint' ? player : {
    ...player,
    timer: Number(player.timer)
  }
) as Merge<P, Player> | null | undefined

export const parseGameURL = (url: string) => (url.match(gameUrlRegEx) || [])[1]

export const getNextPlayerId = (playerId: Player['id'], game?: Pick<Game, "round"|"roundCount"> & { players: Array<{ id: Player['id'] }> }) => {
  if (!game || game.players.length <= 1) return undefined
  const playerIdx = game.players.findIndex(({ id }) => playerId === id)
  if (playerIdx === -1) return undefined
  
  return game.players[getNeighborIdx(game, game.players.length, playerIdx, true)]?.id
}

export const hasPack = (game: Pick<Game,"round"|"roundCount">, players: Pick<BasicPlayer,"id"|"pick">[], playerIdx: number, packSize: number) => {
  if (!game || !players[playerIdx]?.pick || game.round < 1 || game.round > game.roundCount || players[playerIdx].pick > packSize) return false

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