import { Prisma } from '@prisma/client'
import type { Set as JsonSet } from '../../../types/json.d'
export { JsonSet }

// DB Adapters

const adaptSetToDb = ({ code, name, releaseDate, block }: JsonSet):
Prisma.CardSetCreateManyInput => ({ code, name, releaseDate, block })


export function adaptSetDataToDb(setData: JsonSet) {
  const set = adaptSetToDb(setData)

  const boosters: Prisma.BoosterCreateManyInput[] = !setData.booster ? [] :
    Object.entries(setData.booster)
      .map(([boosterType, data]) => ({
        setCode: setData.code,
        boosterType,
        data: data as any
      }))
    
  return  { set, boosters }
}


// Helpers

export const isBoosterSet = (setData: JsonSet): setData is JsonSet => Boolean(setData.code && setData.name && 'booster' in setData)

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
