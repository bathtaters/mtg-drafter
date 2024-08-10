import type { SetBooster } from 'types/setup'
import { Card, Color } from '@prisma/client'
import { randomElemWeighted } from 'backend/libs/random'
import { COLOR_BASE, OTHER, compareKeys, getReplaceIndex } from 'backend/utils/setup/booster.utils'

const MAX_PER_COLOR = 4, MIN_PER_COLOR = 1, DEBUG = false

/** Color balance pack (Drawing from pool if needed) */
export default function balanceColors(pack: Card[], pool: Record<string, number>, cards: SetBooster['cards']) {
  DEBUG && console.log(`--Balancing colors for ${pack[0].setCode}`)

  const colorCount = pack.reduce((sums, card) => {
    sums[card.monoColor || OTHER]++
    return sums
  }, { ...COLOR_BASE })

  
  for (let notChanged = false; notChanged = !notChanged; ) {
    Object.keys(Color).forEach((color) => {
      DEBUG && console.log(` > Pack color counts: ${Object.entries(colorCount).map(([c,n]) => `${c}${c === color ? '*' : ':'}${n}`).join(' ')}`)

      while (colorCount[color] < MIN_PER_COLOR) {
        DEBUG && console.log(` >   Too few ${color}:`)
        
        const subPool = Object.keys(pool).reduce(
          (sub, id) => cards[id].monoColor === color && !pack.find(({ uuid }) => uuid === id) ? { ...sub, [id]: pool[id] } : sub,
          {} as Record<string, number>,
        )

        DEBUG && console.log(` >     - Found ${Object.keys(subPool).length} unique ${color} cards out of ${Object.keys(pool).length} to add`)
        if (!Object.keys(subPool).length) {
          console.warn(`Unable to color-balance for ${color}: No new ${color} cards exist in pool.`)
          break // No cards of this color exist
        }

        const replColors = compareKeys(colorCount, (a,b) => a - b) // max
        DEBUG && console.log(` >     - Searching ${pack.length} cards for ${replColors.join('/')} card to remove`)

        const replIdx   = getReplaceIndex(pack, replColors)
        if (replIdx < 0) throw new Error('No valid replacement while color balancing (Perhaps due to empty pack)')
        
        colorCount[pack[replIdx].monoColor || OTHER]--
        DEBUG && console.log(` >     - Removed card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)

        pack[replIdx] = cards[randomElemWeighted(subPool) as string]
        colorCount[pack[replIdx].monoColor || OTHER]++
        DEBUG && console.log(` >     - Added card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)
        notChanged = false
      }

      while (colorCount[color] > MAX_PER_COLOR) {
        DEBUG && console.log(` >   Too many ${color}:`)

        const replColors = compareKeys(colorCount, (a,b) => b - a) // min
        const subPool = Object.keys(pool).reduce(
          (sub, id) => cards[id].monoColor === color && replColors.includes(cards[id].monoColor) && !pack.find(({ uuid }) => uuid === id) ? { ...sub, [id]: pool[id] } : sub,
          {} as Record<string, number>,
        )

        DEBUG && console.log(` >     - Found ${Object.keys(subPool).length} unique ${replColors.join('/')} cards out of ${Object.keys(pool).length} to add`)
        if (!Object.keys(subPool).length) {
          console.warn(`Unable to color-balance for ${color}: No new ${replColors.join('/')} cards exist in pool.`)
          break // No cards of this color exist
        }

        DEBUG && console.log(` >     - Searching ${pack.length} cards for ${color} card to remove`)
        const replIdx   = getReplaceIndex(pack, [color])
        if (replIdx < 0) throw new Error('No valid replacement while color balancing (Perhaps due to empty pack)')
        
        colorCount[pack[replIdx].monoColor || OTHER]--
        DEBUG && console.log(` >     - Removed card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)

        pack[replIdx] = cards[randomElemWeighted(subPool) as string]
        colorCount[pack[replIdx].monoColor || OTHER]++
        DEBUG && console.log(` >     - Added card "${pack[replIdx].name}" (${pack[replIdx].colors.join('/')})`)
        notChanged = false
      }

    })
  }

  DEBUG && console.log(`--Final color counts: ${Object.entries(colorCount).map(([c,n]) => `${c}:${n}`).join(' ')}`)
  return pack
}