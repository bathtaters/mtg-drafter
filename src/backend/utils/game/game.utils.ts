import { nanoid } from 'nanoid'
import { BasicLands } from '../../../types/definitions'

export const colorOrder = ['w','u','b','r','g'] as Array<keyof BasicLands>

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

export const randomUrl = () => nanoid(9)