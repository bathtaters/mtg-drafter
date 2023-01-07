import type { PackCard } from 'types/setup'
import { nanoid } from 'nanoid'
import { randomPop } from 'backend/libs/random'
import { urlLength } from 'assets/constants'

export const randomUrl = () => nanoid(urlLength)

export const createPlayers = (playerCount: number) => [...Array(playerCount)].map((_,idx) => ({ name: `Player ${idx + 1}` }))

export function createPacks(cardList: string[], packCount: number, packSize: number, foil = false) {
  if (packCount * packSize > cardList.length) throw new Error(`Not enough cards (${cardList.length}). Must have at least ${packCount * packSize} for this size game.`)
  let packs: PackCard[][] = [], next: PackCard[] = []
  for (let p = 0; p++ < packCount; next = []) {
    for (let c = 0; c++ < packSize; ) {
      next.push({ cardId: randomPop(cardList), foil })
    }
    packs.push(next)
  }
  return packs
}
