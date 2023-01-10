import type { Card } from "@prisma/client"
import { colorOrder, rarityOrder, typeOrder } from "assets/sort.constants"

const colorOrderUpper = colorOrder.map((c) => c.toUpperCase())

export const sortKeys = ["none", "rarity", "color", "type", "cost"] as const
export type SortKey = typeof sortKeys[number]
export type CardSorter = (a: Card, b: Card) => number
type SortValue = (card: Card) => number


const sortValue: { [algo in SortKey]: SortValue } = {
  none: () => 0,

  rarity: (card) => rarityOrder.indexOf(card.rarity || 'none'),

  color:  (card) => card.colors.length === 1 ?
    colorOrderUpper.indexOf(card.colors[0]) :
    !card.colors.length ? 11 : 4 + card.colors.length,

  type:   (card) => Math.min(...card.types.map((type) => typeOrder.indexOf(type))),

  cost:   (card) => card.manaValue || 0,
}

const raritySort: CardSorter = (a, b) => sortValue.rarity(a) - sortValue.rarity(b)
const colorSort:  CardSorter = (a, b) => sortValue.color(a)  - sortValue.color(b)
const typeSort:   CardSorter = (a, b) => sortValue.type(a)   - sortValue.type(b)
const costSort:   CardSorter = (a, b) => sortValue.cost(a)   - sortValue.cost(b)
const nameSort:   CardSorter = (a, b) => a.name.localeCompare(b.name)
const tieBreak:   CardSorter = (a, b) => a.uuid.localeCompare(b.uuid)

export const deckSort: CardSorter = (a, b) => colorSort(a,b) ||
  typeSort(a,b) || costSort(a,b) || nameSort(a,b) || tieBreak(a,b)

export const packSort: { [key in SortKey]: CardSorter } = {
  none:   ()     => 0,
  rarity: (a, b) => raritySort(a,b) || deckSort(a,b),
  color:  (a, b) => colorSort(a,b) || typeSort(a,b) || costSort(a,b) || raritySort(a,b) || nameSort(a,b) || tieBreak(a,b),
  type:   (a, b) => typeSort(a,b) || costSort(a,b) || colorSort(a,b) || raritySort(a,b) || nameSort(a,b) || tieBreak(a,b),
  cost:   (a, b) => costSort(a,b) || typeSort(a,b) || colorSort(a,b) || raritySort(a,b) || nameSort(a,b) || tieBreak(a,b),
}
