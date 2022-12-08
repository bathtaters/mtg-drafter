import type { BasicLands, BoardLands, GameCardFull } from "types/game"
import { colorOrder } from "assets/constants"
import { sameValueObject } from "components/base/services/common.services"
import { getBoard } from "../shared/game.utils"

const pipRegEx = /{([^}]+)}/g // pip format: {<color>}

const landAlogrithm = (colorPips: number, totalPips: number, landsNeeded: number) => totalPips ? 
  Math.round(landsNeeded * colorPips / totalPips) : // ratio of colorPips to totalPips, scaled to landsNeeded
  Math.round(landsNeeded / colorOrder.length)       // if no pips, use landsNeeded / # of colors (5)


export default function getAutoLands(playerCards: GameCardFull[], deckSize: number, sideboardCount: number) {
  const mainDeck = getBoard(playerCards, 'main')

  const landCount = deckSize - mainDeck.length
  if (landCount < 1) return `Main-board (${mainDeck.length}) is larger than deck size (${deckSize}). Lands weren't updated.`

  let result = { main: {}, side: {} } as BasicLands
  const pips = countPips(mainDeck)

  colorOrder.forEach((c) => {
    result.main[c] = landAlogrithm(pips[c], pips.sum, landCount)
    result.side[c] = sideboardCount
  })

  return result
}


const blankCounter = sameValueObject<BoardLands & { lands: number, sum: number }>([...colorOrder, 'lands', 'sum'], 0)

function countPips(cardList: GameCardFull[]) {
  let count = { ...blankCounter }

  cardList.forEach(({ card }) => {
    if (card.types.includes('Land')) count.lands++
    if (!card.manaCost) return

    for (let match: RegExpExecArray | null; match = pipRegEx.exec(card.manaCost); ) {
      const pip = match[1].toLowerCase()
      for(let i = pip.length; i--; ) {
        if (pip.charAt(i) in count) count[pip.charAt(i) as keyof BoardLands]++
      }
    }
  })
  
  count.sum = Object.keys(count).reduce((sum,c) =>
    c.length === 1 ? sum + count[c as keyof BoardLands] : sum,
    0
  )
  return count
}
