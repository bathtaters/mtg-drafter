import type { Card } from '@prisma/client'
import type { PackCard, SetBooster } from 'types/setup'
import { getFullSet } from './sets.services'
import balanceColors from './balanceColors'
import { sortSheets } from 'backend/utils/setup/booster.utils'
import { randomElemWeighted, shuffle } from 'backend/libs/random'
import { logSheetNames } from 'assets/constants'
import { landNames } from 'assets/sort.constants'

const landCards = Object.values(landNames)

export default async function buildBoosterPacks(boosterCodes: string[], playerCount: number, includeBasics = true): Promise<PackCard[][]> {
  let packs: PackCard[][] = [], setCache: Record<string, SetBooster> = {}
  
  for (const boosterCode of boosterCodes) {
    
    const boosterData = boosterCode in setCache ? setCache[boosterCode] : await getFullSet(boosterCode)
    if (!boosterData) throw new Error(`Invalid booster code '${boosterCode},' or database is outdated.`)
    if (!(boosterCode in setCache)) setCache[boosterCode] = boosterData

    for (let i = 0; i < playerCount; i++) {
      packs.push(buildBoosterPack(boosterData, includeBasics))
    }
  }
  return packs
}


function buildBoosterPack(booster: SetBooster, includeBasics = true) {
  const layout = booster.data.boosters.length === 1 ?
    booster.data.boosters[0].contents :
    randomElemWeighted(booster.data.boosters, booster.data.boostersTotalWeight)?.contents
  if (!Object.keys(booster.cards).length) throw Error(`Booster build for ${booster.setCode} failed due to missing card data.`)
  if (!layout) return []
  
  const sheetsNames = sortSheets(layout)
  logSheetNames && console.log(` > Sheet names [${booster.setCode}]: ${sheetsNames.join(', ')}`)
  
  let pack: PackCard[] = []
  sheetsNames.forEach((sheetName) => {
    const sheetData = booster.data.sheets[sheetName]
    if (!sheetData) throw new Error(`${sheetName} sheet not found in set ${booster.setCode}`)
    if ((layout[sheetName] ?? 0) < 1 || Object.keys(sheetData.cards).length < 1)
      throw new Error(`Invalid sheet card count [${booster.setCode}]: ${sheetName}`);

    let nextId: string, newCards: Card[] = [], count = layout[sheetName] ?? 0
    for (let i=0; i < count; i++) {
      do { // select unique card
        nextId = randomElemWeighted(sheetData.cards, sheetData.totalWeight)
      } while (!(nextId in booster.cards) || (!sheetData.allowDuplicates && newCards.some(({ uuid }) => nextId === uuid)))
      
      if (includeBasics || !landCards.includes(booster.cards[nextId].name)) newCards.push(booster.cards[nextId])
    }
    
    if (sheetData.balanceColors) {
      balanceColors(newCards, sheetData.cards, booster.cards)
      shuffle(newCards)
    }

    pack.push(...newCards.map(({ uuid }) => ({ cardId: uuid, foil: sheetData.foil })))
  })

  return pack
}
