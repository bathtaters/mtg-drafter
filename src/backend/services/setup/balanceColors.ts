import type { BoosterCardFull } from 'types/setup'
import { Card, Color } from '@prisma/client'
import { randomElemWeighted } from 'backend/libs/random'
import { compareKeys, getReplaceIndex } from 'backend/utils/setup/booster.utils'

const COLOR_BASE = Object.fromEntries(Object.keys(Color).concat("other").map((c) => [c, 0])) as Record<Color|"other", number>

const MAX_PER_COLOR = 4, MIN_PER_COLOR = 1, DEBUG = false


/** Color balance pack (Drawing from pool if needed) */
export default function balanceColors(pack: Card[], pool: BoosterCardFull[]) {
  DEBUG && console.log(`--Balancing colors for ${pool[0].setCode}`)

  const colorCount = pack.reduce((sums, card) => {
    sums[card.monoColor || 'other']++
    return sums
  }, { ...COLOR_BASE })

  
  for (let notChanged = false; notChanged = !notChanged; ) {
    (Object.keys(Color) as Color[]).forEach((color) => {
      DEBUG && console.log(` > Pack color counts: ${Object.entries(colorCount).map(([c,n]) => `${c}${c === color ? '*' : ':'}${n}`).join(' ')}`)

      while (colorCount[color] < MIN_PER_COLOR) {
        DEBUG && console.log(` >   Too few ${color}:`)
        
        const subPool = pool.filter(({ card }) => card.monoColor === color && !pack.find(({ uuid }) => uuid === card.uuid))
        DEBUG && console.log(` >     - Found ${subPool.length} unique ${color} cards out of ${pool.length} to add`)
        if (!subPool.length) {
          console.warn(`Unable to color-balance for ${color}: No new ${color} cards exist in pool.`)
          break // No cards of this color exist
        }

        const replColors = compareKeys(colorCount, (a,b) => a - b) // max
        DEBUG && console.log(` >     - Searching ${pack.length} cards for ${replColors.join('/')} card to remove`)
        const replIdx   = getReplaceIndex(pack, replColors)
        if (replIdx < 0) throw new Error('No valid replacement while color balancing (Perhaps due to empty pack)')
        
        colorCount[pack[replIdx].monoColor || 'other']--
        DEBUG && console.log(` >     - Removed card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)
        pack[replIdx] = randomElemWeighted(subPool)?.card as Card
        colorCount[pack[replIdx].monoColor || 'other']++
        DEBUG && console.log(` >     - Added card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)
        notChanged = false
      }

      while (colorCount[color] > MAX_PER_COLOR) {
        DEBUG && console.log(` >   Too many ${color}:`)

        const replColors = compareKeys(colorCount, (a,b) => b - a) // min
        const subPool = pool.filter(({ card }) => card.monoColor && replColors.includes(card.monoColor) && !pack.find(({ uuid }) => uuid === card.uuid))
        DEBUG && console.log(` >     - Found ${subPool.length} unique ${replColors.join('/')} cards out of ${pool.length} to add`)
        if (!subPool.length) {
          console.warn(`Unable to color-balance for ${color}: No new ${replColors.join('/')} cards exist in pool.`)
          break // No cards of this color exist
        }

        DEBUG && console.log(` >     - Searching ${pack.length} cards for ${color} card to remove`)
        const replIdx   = getReplaceIndex(pack, [color])
        if (replIdx < 0) throw new Error('No valid replacement while color balancing (Perhaps due to empty pack)')
        
        colorCount[pack[replIdx].monoColor || 'other']--
        DEBUG && console.log(` >     - Removed card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)
        pack[replIdx] = randomElemWeighted(subPool)?.card as Card
        colorCount[pack[replIdx].monoColor || 'other']++
        DEBUG && console.log(` >     - Added card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)
        notChanged = false
      }

    })
  }

  DEBUG && console.log(`--Final color counts: ${Object.entries(colorCount).map(([c,n]) => `${c}:${n}`).join(' ')}`)
  return pack
}