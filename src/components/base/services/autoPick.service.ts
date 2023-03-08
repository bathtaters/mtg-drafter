import type { PackFull, GameCardFull, CardFull } from "types/game"
import { Color } from "@prisma/client"
import { pickSort } from "./cardSort.services"

const NONE = "none" as const
const colorBase = () => Object.fromEntries([...Object.keys(Color), NONE].map((c) => [c, 0]))


const getMaxValue = <T = any>(array: T[], sortAlgo: (a: T, b: T) => number) => {
  let max: T | undefined
  array.forEach((entry) => { if (max === undefined || sortAlgo(max, entry) > 0) max = entry })
  return max
}


const getColorRating = (card: CardFull, colorRank: ReturnType<typeof colorBase>) => {
  // If no matches, but card is colorless, add half a point
  const colorCount = card.colors.length
  if (!colorCount) return colorRank.none || 0.5
  
  // Rating based on similarity to colorRank (With bonus for multiple matching colors)
  let multibonus = -1
  const rating = card.colors.reduce((rating, color) => {
    if (colorRank[color]) multibonus++
    return rating + colorRank[color]
  }, 0)

  return Math.round(((colorCount > 1 ? multibonus : 0) + rating) / colorCount)
}  


export default function getAutopickCard(pack: PackFull, playerCards: GameCardFull[] = []) {
  if (!playerCards.length) return getMaxValue(pack.cards, (a, b) => pickSort(a.card,b.card))?.id

  // Order colors in player's main board from most to least
  const colorRank = playerCards.filter((card) => card.board === 'main').reduce((colors, card) => {
    if (!card.card.colors.length) colors.none++
    else card.card.colors.forEach((c) => colors[c]++)
    return colors
  }, colorBase())
  
  return getMaxValue(pack.cards, (a, b) =>
    (getColorRating(b.card, colorRank) - getColorRating(a.card, colorRank)) ||
    pickSort(a.card, b.card)
  )?.id
}