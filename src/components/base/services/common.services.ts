export const titleCase = (camelCase: string) => camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim()

export const mod = (n: number, m: number) => ((n % m) + m) % m

export const formatBytes = (bytes: number, decimals = 2) => {
  if(!bytes) return "0 Bytes"
  const c = 0 > decimals ? 0 : decimals, d = Math.floor(Math.log(bytes)/Math.log(1024))
  return `${parseFloat((bytes/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}`
}


export const updateArrayIdx = <T>(array: T[], find: ((entry: T, idx: number) => boolean) | number, newVal: ((entry: T, idx: number) => T)) => {
  const idx = typeof find === 'number' ? find : array.findIndex(find)
  if (idx === -1) return array
  return array.map((entry,i) => i !== idx ? entry : newVal(entry, i))
}

export const spliceInPlace = <T>(array: T[], find: ((entry: T, idx: number) => boolean) | number, removeCount: number = 1, ...insert: T[]) => {
  const idx = typeof find === 'number' ? find : array.findIndex(find)
  if (idx === -1) return array
  return array.slice(0, idx).concat(insert).concat(array.slice(idx + removeCount))
}

export const sameValueObject = <T extends { [key: string]: any }> (keys: (keyof T)[], value: T[keyof T]): T =>
  Object.fromEntries(keys.map((key) => [key, value])) as T

export const getObjectSum = (obj: { [key: string]: number }) => Object.values(obj).reduce((sum, n) => sum + n, 0)


export const throttle = (delay: number) => {
  let pause: boolean

  return (callback: () => void) => {
    if (pause) return;
    
    pause = true
    callback()
    setTimeout(() => { pause = false }, delay)
  };
}

export function debounce<A extends [] = []>(callback: (...args: A) => void, delay = 500) {
  let timeout: NodeJS.Timeout

  return (...args: A) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
