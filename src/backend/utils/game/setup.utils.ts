import type { BoosterLayoutFull, BoosterCardFull } from 'types/setup'
import { Card, Color } from '@prisma/client'
import { randomElemWeighted, randomElem, swapInPlace } from 'backend/libs/random'
import { boosterSortOrder } from 'assets/constants'

export const colorCountBase = Object.fromEntries(Object.keys(Color).concat("other").map((c) => [c, 0])) as Record<Color|"other", number>

export const maxKey = <T extends { [key: string]: any }>(obj: T) => Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b, '' as keyof T)

export const getReplaceIndex = (cards: Card[], color: Color|"other") => {
  const colorFilter = color === 'other' ?
    (card: Card) => !card.monoColor :
    (card: Card) => card.monoColor === color

  const replaceId = randomElem(cards.filter(colorFilter)).uuid
  return cards.findIndex(({ uuid }) => uuid === replaceId)
}

/** Order array using boosterSortOrder (in defintions) -- CAN IMPROVE  */
export function sortSheets(layout: BoosterLayoutFull['sheets']) {
  const end = boosterSortOrder.length
  for (let i = 0, toIndex = layout.length; i < end; i++) {
      
    const fromIndex = layout.findIndex((elem) => elem.sheetName == boosterSortOrder[i])
    if (fromIndex < 0) continue

    swapInPlace(layout, fromIndex, --toIndex)
  }
  return layout
}

/** Color balance pack (Drawing from pool if needed) */
export function balanceColors(pack: Card[], pool: BoosterCardFull[], totalWeight = 0) {

  const colorCount = pack.reduce((sums, card) => {
    sums[card.monoColor || 'other']++
    return sums
  }, { ...colorCountBase });
  
  (Object.keys(colorCount) as (keyof typeof colorCount)[]).forEach((color) => {
    if (colorCount[color]) return
    
    const subPool = pool.filter((card) => card.card.monoColor === color)
    if (!subPool.length) return // No cards of this color exist
    
    const replColor = maxKey(colorCount)
    const replIdx   = getReplaceIndex(pack, replColor)
    if (replIdx < 0) throw new Error('No valid replacement while color balancing (Perhaps due to empty pack)')

    pack[replIdx] = randomElemWeighted(subPool,totalWeight).card
    colorCount[color]++
    colorCount[replColor]--
  })
  return pack
}