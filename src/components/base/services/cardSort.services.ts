import type { Card } from "@prisma/client";
import { colorOrder, rarityOrder, typeOrder } from "assets/constants";
const colorOrderUpper = colorOrder.map((c) => c.toUpperCase())

const sortKeys = ["rarity", "color", "type", "mana"] as const
type SortKey = typeof sortKeys[number]
type SortValue = (card: Card) => number
type CardSorter = (a: Card, b: Card) => number


const sortValue: { [algo in SortKey]: SortValue } = {
  rarity: (card) => rarityOrder.indexOf(card.rarity || 'none'),

  color:  (card) => card.colors.length === 1 ?
    colorOrderUpper.indexOf(card.colors[0]) :
    !card.colors.length ? 11 : 4 + card.colors.length,

  type:   (card) => Math.max(...card.types.map((type) => typeOrder.indexOf(type))),

  mana:   (card) => card.manaValue || 0,
}

export const raritySort: CardSorter = (a, b) => sortValue.rarity(a) - sortValue.rarity(b)
export const colorSort:  CardSorter = (a, b) => sortValue.color(a)  - sortValue.color(b)
export const typeSort:   CardSorter = (a, b) => sortValue.type(a)   - sortValue.type(b)
export const manaSort:   CardSorter = (a, b) => sortValue.mana(a)   - sortValue.mana(b)
export const nameSort:   CardSorter = (a, b) => a.name.localeCompare(b.name)
export const tieBreak:   CardSorter = (a, b) => a.uuid.localeCompare(b.uuid)

export const deckSort: CardSorter = (a, b) => colorSort(a,b) ||
  typeSort(a,b) || manaSort(a,b) || nameSort(a,b) || tieBreak(a,b)

export const packSort: CardSorter = (a, b) => raritySort(a,b) || deckSort(a,b)
