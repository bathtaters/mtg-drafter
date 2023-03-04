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

export const clampText = (text: string, charactersPerLine: number, maxLines = 1,
  { ellipsis = '…', wordBreak = '-', lineBreak = '\n', spaceChars = ' _-' } = {}
) => {
  if (text.length <= charactersPerLine) return text // short-circuit short input

  let lines: string[] = []
  while (text.length > 0 && lines.length < maxLines) {
    // Find last space before charactersPerLine
    let split = revIndexOfChar(text, spaceChars, charactersPerLine), lineEnd = ''

    // If no space, set break to max size + word splitter (ie. hyphen)
    if (text.length <= charactersPerLine) split = text.length
    else if (split < 0) split = charactersPerLine - wordBreak.length, lineEnd = wordBreak

    // Append next line 
    lines.push(text.substring(0, split).trim() + lineEnd)

    // Shrink buffer & trim whitespace
    text = text.substring(split).trim()
  }

  // Add ellipsis if text is remaining in buffer
  if (text.length)
    lines[lines.length - 1] = lines[lines.length - 1].substring(0, charactersPerLine - ellipsis.length) + ellipsis
  
  return lines.join(lineBreak)
}

export const formatTime = (seconds: number) => {
  if (seconds < 60) return [ seconds ]
  if (seconds < 3600) return [ Math.floor(seconds / 60), ':', seconds % 60 ]
  if (seconds < 86400) return [ Math.floor(seconds / 3600), ':', Math.floor(seconds / 60) % 60 ]
  return [ (seconds / 86400).toFixed(1), 'd' ]
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

export const appendIfNotInList = (arrayList: any[][], newArray: any[]) => arrayList.some((array) => array.length === newArray.length &&
  newArray.every((entry,i) => typeof entry === 'function' ? typeof array[i] === 'function' : entry.toString() === array[i].toString())
) ? -1 : arrayList.push(newArray)

export const sameValueObject = <T extends { [key: string]: any }> (keys: (keyof T)[], value: T[keyof T]): T =>
  Object.fromEntries(keys.map((key) => [key, value])) as T

export const getObjectSum = (obj: { [key: string]: number }) => Object.values(obj).reduce((sum, n) => sum + n, 0)

export const revIndexOfChar = (str: string, charList: string, maxIndex = -1) => {
  const end = maxIndex < 0 || maxIndex > str.length ? str.length : maxIndex
  for (let i = end; i > 0; i--) {
    if (charList.includes(str.charAt(i - 1))) return i
  }
  return -1
}

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
