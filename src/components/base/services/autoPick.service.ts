import { PackFull, GameCardFull } from "types/game";
import { packSort } from "./cardSort.services";

const getMaxValue = <T = any>(array: T[], sortAlgo: (a: T, b: T) => number) => {
  let max: T | undefined
  array.forEach((entry) => { if (max === undefined || sortAlgo(max, entry) > 0) max = entry })
  return max
}

export default function getAutopickCard(pack: PackFull, playerCards: GameCardFull[] = []) {
  return getMaxValue(pack.cards, (a, b) => packSort.rarity(a.card,b.card))?.id
}