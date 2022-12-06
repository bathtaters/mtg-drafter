import type { Game, Player } from '@prisma/client'
import { nanoid } from 'nanoid'
import { gameUrlRegEx } from 'assets/urls'
import { getNeighborIdx } from 'components/game/shared/game.utils'
import { urlLength } from 'assets/constants'

export const parseGameURL = (url: string) => (url.match(gameUrlRegEx) || [])[1]

const randomInt = (max: number, min: number = 0) => min + Math.floor(Math.random() * max)
const popRandom = <T = any>(array: T[]) => array.splice(randomInt(array.length), 1)[0]

export function createPacks(cards: string[], packCount: number, packSize: number) {
  if (packCount * packSize > cards.length) throw new Error(`Not enough cards. Requires ${packCount * packSize} for this size game.`)
  let packs = [], next = []
  for (let p = 0; p++ < packCount; next = []) {
    for (let c = 0; c++ < packSize; ) {
      next.push(popRandom(cards))
    }
    packs.push(next)
  }
  return packs
}

export const createPlayers = (playerCount: number) => [...Array(playerCount)].map((_,idx) => ({ name: `Player ${idx + 1}` }))

export const randomUrl = () => nanoid(urlLength)

export const getNextPlayerId = (playerId: Player['id'], game?: Pick<Game, "round"|"roundCount"> & { players: Array<{ id: Player['id'] }> }) => {
  if (!game || game.players.length <= 1) return undefined
  const playerIdx = game.players.findIndex(({ id }) => playerId === id)
  if (playerIdx === -1) return undefined
  
  return game.players[getNeighborIdx(game, game.players.length, playerIdx, true)]?.id
}

export const unregGameAdapter = ({ id, name, url }: Game) => ({ id, name, url })
