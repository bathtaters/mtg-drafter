import type { BoosterLayoutFull } from 'types/setup'
import { Card, Color } from '@prisma/client'
import { randomElem } from 'backend/libs/random'
import { boosterSortOrder } from 'assets/sort.constants'

export const OTHER = "other" as const
export const COLOR_BASE = Object.fromEntries([...Object.keys(Color), OTHER].map((c) => [c, 0]))


export const compareKeys = <T extends {}>(obj: T, compare: (a: T[keyof T], b: T[keyof T]) => number) =>
  Object.keys(obj).reduce((keys, key) => {
    if (!keys.length) return [key]
    const result = compare(obj[keys[0]], obj[key])
    return !result ? keys.concat(key) : result > 0 ? keys : [key]
  }, [] as Array<keyof T>)


export const getReplaceIndex = (cards: Card[], colors: Array<Color|typeof OTHER>) => {
  const replaceId = randomElem(cards.filter((card: Card) => colors.includes(card.monoColor || OTHER)))?.uuid
  return replaceId ? cards.findIndex(({ uuid }) => uuid === replaceId) : -1
}


export const sortSheets = (layout: BoosterLayoutFull['sheets']) => layout.sort((a,b) =>
  boosterSortOrder.indexOf(a.sheetName) - boosterSortOrder.indexOf(b.sheetName)
)

