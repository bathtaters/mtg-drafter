// Helpers
import { randomInt as randomAlgo } from 'crypto'
// const randomAlgo = (min: number, max: number) => min + Math.floor(Math.random() * (max - min))

export const swapInPlace = (arr: any[], idxA: number, idxB: number) => { if (idxA != idxB) [arr[idxA], arr[idxB]] = [arr[idxB], arr[idxA]] }

// Exports

export const randomInt = (maxExcl: number, minInclu = 0) => randomAlgo(minInclu,maxExcl)

export const randomElem = <T = any>(array: T[]) => array.length ? array[randomInt(array.length)] : undefined

export const randomPop = <T = any>(array: T[]) => array.splice(randomInt(array.length), 1)[0]

/** Shuffles an array using Fisher-Yates */ 
export function shuffle<T = any>(array: T[]) {
    let i = array.length
    while (i--) { swapInPlace(array, i, randomInt(i + 1)) }
    return array
}

/** Returns element in array using "weight" prop of each element to weigh randomness
 * (Only returns undef when array is empty) */
export function randomElemWeighted<T extends { weight: number }>(array: T[], totalWeight = 0) {
  if (!array.length) throw new Error('Called randomElemWeighted with empty array')
  
  if (totalWeight < 1) totalWeight = array.reduce((sum,elem) => sum + elem.weight, 0)
  if (totalWeight < 1) { 
    console.warn('Unable to find weights for random choice, using equal weights.')
    return randomElem(array)
  }
  
  let sum = 0, randomIndex = randomInt(totalWeight) + 1
  return array.find(({ weight }) => (sum += weight) > randomIndex) ?? array[array.length - 1]
}