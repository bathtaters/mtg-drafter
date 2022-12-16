import { DependencyList, useEffect, useRef } from 'react'

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

export const spliceInPlace = <T>(array: T[], find: ((entry: T, idx: number) => boolean) | number, removeCount: number = 1) => {
  const idx = typeof find === 'number' ? find : array.findIndex(find)
  if (idx === -1) return array
  return array.slice(0, idx).concat(array.slice(idx + removeCount))
}

export const sameValueObject = <T extends { [key: string]: any }> (keys: (keyof T)[], value: T[keyof T]): T =>
  Object.fromEntries(keys.map((key) => [key, value])) as T

export const getObjectSum = (obj: { [key: string]: number }) => Object.values(obj).reduce((sum, n) => sum + n, 0)

export const canShare = () => typeof window === 'undefined' ? false : Boolean(window.navigator.share || window.navigator.clipboard?.writeText)
export async function shareData(text: string, url: string, title: string): Promise<"copy"|"share"|"error"|"unavailable"> {
  if (window.navigator.share)
    return window.navigator.share({ title, url, text }).catch(() => true).then((isErr) => isErr ? 'error' : 'share')
  else if (window.navigator.clipboard?.writeText)
    return window.navigator.clipboard.writeText(url).then(() => 'copy')
  return 'unavailable'
}

export function useFocusEffect(onFocus: (isFocused: boolean) => void, dependencies?: DependencyList, minimumDelay: number = 0) {
  const timestamp = useRef(new Date().getTime())
  const handleEvent = (isFocused: boolean) => {
    const now = new Date().getTime()
    if (now - timestamp.current >= minimumDelay) onFocus(isFocused)
    timestamp.current = now
  }

  useEffect(() => {
    const handleFocus = () => handleEvent(true)
    const handleBlur  = () => handleEvent(false)

    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur",  handleBlur)
    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur",  handleBlur)
    }
  }, dependencies)
}