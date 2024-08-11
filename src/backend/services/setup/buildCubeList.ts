import type { Card } from '@prisma/client'
import prisma from '../../libs/db'
import { normalizeName } from '../../utils/db/card.utils'
import { CUBE_LIST_END } from 'assets/constants'


const getBestMatch = (cards: Card[]) => {
  if (cards.length === 0) return
  if (cards.length === 1) return cards[0]
  
  let result = cards.find(({ preferredArt }) => preferredArt)
  if (result) return result
  
  result = cards.find(({ img }) => img)
  if (result) return result

  return cards[0]
}

export default async function buildCubeList(cardNames: string[], callback?: (count: number) => void, callPercent: number = 10) {
  const callAt = callback && Math.floor(cardNames.length / (100 / callPercent))
  let accepted: string[] = [], rejected: string[] = [], count = 0

  const end_idx = cardNames.findIndex((name) => CUBE_LIST_END.test(name))
  if (end_idx !== -1) cardNames = cardNames.slice(0, end_idx)

  cardNames = cardNames.filter((name) => name.trim() && !name.startsWith("#")).map(normalizeName)

  const cards = await prisma.card.findMany({ where: { normalName: { in: cardNames } }})

  cardNames.forEach((cardName) => {
    const card = getBestMatch(cards.filter(({ normalName }) => normalName === cardName))

    if (card) accepted.push(card.uuid)
    else rejected.push(cardName)

    if (callAt && ++count % callAt === 0) callback(count)
  })

  return { accepted, rejected }
}
