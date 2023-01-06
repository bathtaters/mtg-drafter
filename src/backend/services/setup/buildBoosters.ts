import type { Card, GameCard } from '@prisma/client'
import type { SetFull } from 'types/setup'
import { getFullSet } from './sets.services'
import { balanceColors, sortSheets } from 'backend/utils/game/setup.utils'
import { randomElemWeighted, shuffle } from 'backend/libs/random'

const LOG_SHEET_NAMES = true


export default async function buildBoosterPacks(setCodes: SetFull['code'][], playerCount: number) {
  let packs: PackCard[][] = [], setCache: SetCache = {}
  
  for (const code of setCodes) {
      
    const setData = code in setCache ? setCache[code] : await getFullSet(code)
    if (!setData) throw new Error(`Invalid set code [${code}], or database is outdated.`)
    if (!(code in setCache)) setCache[code] = setData

    for (let i = 0; i < playerCount; i++) {
      packs.push(buildBoosterPack(setData))
    }
  }
  return packs
}


function buildBoosterPack(setData: SetFull) {
  const layout = setData.boosters.length === 1 ?
    setData.boosters[0].sheets :
    randomElemWeighted(setData.boosters, setData.totalWeight).sheets
  
  const sheets = sortSheets(layout)
  LOG_SHEET_NAMES && console.log(` > Sheet names [${setData.code}]: ${sheets.map(entry => entry.sheetName).join(', ')}`)
  
  let pack: PackCard[] = []
  sheets.forEach((sheet) => {
    const sheetData = setData.sheets[sheet.sheetName]
    if (!sheetData) throw new Error(`${sheet.sheetName} sheet not found in set ${setData.code}`)
    if (sheet.selectCount < 1) throw new Error(`Invalid sheet card count [${setData.code}]: ${JSON.stringify(sheet)}`);

    let nextCard: Card, newCards: Card[] = [];
    for (let i=0; i < sheet.selectCount; i++) {
      do { // select unique card
        nextCard = randomElemWeighted(sheetData.cards, sheetData.totalWeight).card;
      } while (newCards.some(({ uuid }) => nextCard.uuid === uuid))
      newCards.push(nextCard)
    }
    
    if (sheetData.balanceColors) {
      balanceColors(newCards, sheetData.cards)
      shuffle(newCards)
    }

    pack.push(...newCards.map(({ uuid }) => ({ cardId: uuid, /* foil: sheetData.foil */ })))
  })

  return pack
}


type SetCache = { [code: SetFull['code']]: SetFull }
type PackCard = Pick<GameCard,'cardId'/*|'foil'*/>