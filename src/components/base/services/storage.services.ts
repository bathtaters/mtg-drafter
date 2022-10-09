import cardZoomLevels from "components/game/styles/cardZoomLevels"

const storagePrefix = 'mtg-drafter-'
const storageDefaults = Object.freeze({
  zoom: `${Math.round(cardZoomLevels.length * 3 / 4)}`,
})

type LocalKeys = keyof typeof storageDefaults

export const getLocalVar = <T = any>(key: LocalKeys): T => {
  const stored = localStorage.getItem(storagePrefix + key)
  if (typeof stored === 'string') return JSON.parse(stored) as T
  setLocalVar(key, storageDefaults[key], true)
  return getLocalVar(key)
}

export const setLocalVar = <T = any>(key: LocalKeys, value: T, overwrite = true) => {
  if (!overwrite && localStorage.getItem(storagePrefix + key) != null) return false
  localStorage.setItem(storagePrefix + key, JSON.stringify(value))
  return true
}

export const rmvLocalVar = (key: LocalKeys) => localStorage.removeItem(storagePrefix + key)

export function setDefaults() {
  Object.entries(storageDefaults).forEach(([key,val]) => {
    setLocalVar(key as LocalKeys, val, false)
  })
}
