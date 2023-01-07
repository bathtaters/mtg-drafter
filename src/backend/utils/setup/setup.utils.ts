import { nanoid } from 'nanoid'
import { randomPop } from 'backend/libs/random'
import { urlLength } from 'assets/constants'

export const randomUrl = () => nanoid(urlLength)

export const createPlayers = (playerCount: number) => [...Array(playerCount)].map((_,idx) => ({ name: `Player ${idx + 1}` }))

export function createPacks(cards: string[], packCount: number, packSize: number) {
  if (packCount * packSize > cards.length) throw new Error(`Not enough cards. Requires ${packCount * packSize} for this size game.`)
  let packs = [], next = []
  for (let p = 0; p++ < packCount; next = []) {
    for (let c = 0; c++ < packSize; ) {
      next.push(randomPop(cards))
    }
    packs.push(next)
  }
  return packs
}
