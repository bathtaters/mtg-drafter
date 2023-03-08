import type { Prisma, BoosterType } from '@prisma/client'
import type { Set } from 'mtggraphql'

// Preferred booster configuration from MTGJSON [ most -> least ]
const boosterPreference: BoosterType[] = ['default', 'arena']


// DB Adapters

const adaptSetToDb = ({ code, name, releaseDate, block, booster }: JsonSet, boosterType: BoosterType):
Prisma.CardSetCreateManyInput => ({
  code, name, releaseDate, block, boosterType,
  totalWeight: booster[boosterType].boostersTotalWeight,
})

const adaptBoosterToDb = ({ weight }: JsonBooster['boosters'][number], setCode: JsonSet['code'], index: number):
Prisma.BoosterLayoutCreateManyInput => ({
  setCode,
  index,
  weight,
})

const adaptContentsToDb = ({ contents }: JsonBooster['boosters'][number], setCode: JsonSet['code'], layoutIdx: number):
Prisma.SheetsInLayoutCreateManyInput[] => Object.entries<typeof contents[keyof typeof contents]>(contents).map(([ sheetName, selectCount ]) => ({
  setCode,
  sheetName,
  layoutIdx,
  selectCount,
}))

const adaptSheetsToDb = (name: string, { foil, balanceColors, totalWeight }: JsonBooster['sheets'][string], setCode: JsonSet['code']):
Prisma.BoosterSheetCreateManyInput => ({
  setCode,
  name,
  foil,
  balanceColors,
  totalWeight,
})

const adaptBoosterCardsToDb = (sheetName: string, { cards }: JsonBooster['sheets'][string], setCode: JsonSet['code']):
Prisma.BoosterCardCreateManyInput[] => Object.entries<typeof cards[keyof typeof cards]>(cards).map(([ cardId, weight ]) => ({
  setCode,
  sheetName,
  cardId,
  weight,
}))



// Main DB Adapter

export function adaptSetDataToDb(setData: JsonSet, boosterType: BoosterType) {
  const base = adaptSetToDb(setData, boosterType)

  let joins: Prisma.SheetsInLayoutCreateManyInput[] = []

  const boosters = setData.booster[boosterType].boosters
    .map((booster, idx) => {
      joins.push(...adaptContentsToDb(booster, setData.code, idx))
      return adaptBoosterToDb(booster, setData.code, idx)
    })

  let cards: Prisma.BoosterCardCreateManyInput[] = []

  const sheets = Object.entries<JsonBooster['sheets'][string]>(setData.booster[boosterType].sheets)
    .map(([ name, sheet ]) => {
      cards.push(...adaptBoosterCardsToDb(name, sheet, setData.code))
      return adaptSheetsToDb(name, sheet, setData.code)
    })
  
  return  { base, boosters, joins, sheets, cards }
}



// Helpers

export const getBoosterType = (booster?: JsonSet['booster']) => booster && boosterPreference.find((type) => type in booster)

export const isBoosterSet = (setData: Set): setData is JsonSet => Boolean(setData.code && setData.name && 'booster' in setData)

export const flattenObjects = <T extends Record<string,any>>(objArr: T[]) => objArr.reduce((result, next) => {
  Object.keys(next).forEach((key: keyof T) => {
    result[key] = (result[key] || [] as any).concat(next[key])
  })
  return result
}, {} as { [K in keyof T]: T[K] extends Array<any> ? T[K] : T[K][] })



// TYPES

interface JsonBooster {
  boostersTotalWeight: number | undefined,
  boosters: Array<{
    weight: number | undefined,
    contents: { [sheet: string]: number },
  }>,
  sheets: {
    [sheet: string]: {
      totalWeight: number | undefined,
      foil: boolean | undefined,
      balanceColors: boolean | undefined,
      cards: { [cardId: string]: number },
    }
  },
}

export interface JsonSet extends Set {
  code: string,
  name: string,
  booster: { [type in BoosterType]: JsonBooster }
}