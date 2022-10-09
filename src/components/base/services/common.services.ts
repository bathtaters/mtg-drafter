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