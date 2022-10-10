import { useCallback, useState } from "react"
import { storageDefaults } from "assets/constants"

const storagePrefix = 'mtg-drafter-'


export type LocalKeys = keyof typeof storageDefaults

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

type SetValue<T> = (value: T) => void
export function useLocalStorage<T = typeof storageDefaults[LocalKeys]>(key: LocalKeys): [ T, SetValue<T> ] {
  const [ value, setValue ] = useState<T>(typeof window !== 'undefined' ? getLocalVar<T>(key) : storageDefaults[key] as T)
  
  const updateValue = useCallback((value: T) => {
    setValue(value)
    setLocalVar(key, value)
  }, [])
  
  return [ value, updateValue ]
}