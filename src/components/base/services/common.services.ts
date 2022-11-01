export const updateArrayIdx = <T>(array: T[], find: ((entry: T, idx: number) => boolean) | number, newVal: ((entry: T, idx: number) => T)) => {
  const idx = typeof find === 'number' ? find : array.findIndex(find)
  if (idx === -1) return array
  return array.map((entry,i) => i !== idx ? entry : newVal(entry, i))
}

export const spliceInPlace = <T>(array: T[], find: ((entry: T, idx: number) => boolean) | number, removeCount: number = 1) => {
  const idx = typeof find === 'number' ? find : array.findIndex(find)
  if (idx === -1) return array
  return array.slice(0, idx).concat(array.slice(idx + removeCount))
}

export const sameValueObject = <T extends { [key: string]: any }> (keys: (keyof T)[], value: T[keyof T]): T =>
  Object.fromEntries(keys.map((key) => [key, value])) as T

export const getObjectSum = (obj: { [key: string]: number }) => Object.values(obj).reduce((sum, n) => sum + n, 0)

export const canShare = () => typeof window === 'undefined' ? false : Boolean(window.navigator.share || window.navigator.clipboard?.writeText)
export async function shareData(text: string, url: string, title: string) {
  if (window.navigator.share)
    return window.navigator.share({ title, url, text }).catch(() => {})
  else if (window.navigator.clipboard?.writeText)
    return window.navigator.clipboard.writeText(url)
}