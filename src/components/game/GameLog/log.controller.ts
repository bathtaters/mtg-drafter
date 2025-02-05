import type { LogAction } from "@prisma/client"
import type { Game, BasicPlayer, LogFull, LogList, LogOptions, LogEntryFull } from "types/game"
import type { LogParams } from "types/log.validation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "components/base/libs/storage"
import { fetcher } from "components/base/libs/fetch"
import { filterEntry, adaptEntry, toLogParams } from "./log.utils"
import { debounce, debounceGroup } from "components/base/services/common.services"
import { logOptions, logFetchOptions } from "assets/constants"
import { allActions, otherPlayers } from "types/logs"

/** NOTE: This will handle combining queries but not caching. */
export default function useGameLog(url: Game['url'], playerData: BasicPlayer[], combineInterval = logFetchOptions.combineInterval) {
  const allPlayers = useMemo(() => playerData.map(({ id }) => id).concat(otherPlayers), [playerData])

  const [ entries, setEntries ] = useState<LogList>({})
  const [ preview, setPreview ] = useState<LogEntryFull[]>()
  const [ total,   setTotal   ] = useState<number>()
  const [ error,   setError   ] = useState<string>()
  const [ players, setPlayers ] = useState(allPlayers)
  const [ options, setOptions ] = useState(logOptions)
  const [ actions, setActions ] = useLocalStorage<LogAction[]>('logActions')
  const [ enabled, setEnabled ] = useState(false)
  const [ data,    setData    ] = useState({ first: 0, next: 0 })

  const logFilter = useCallback((entry?: LogEntryFull) => filterEntry(entry, players, actions, options), [players, actions, options])

  const fetchLogs = useCallback(async ({ offset, size = logFetchOptions.defaultSize, isPreview, options, players, actions }: FetchParams = {}) => {

    // Build query
    let params: Partial<Record<keyof LogParams, string>> = { size: size.toString() }
    if (offset != null) params.offset = offset.toString()
    if (players || actions || options) {
      params.filter = JSON.stringify({ ...(options || {}), players, actions })
    }
    const query = new URLSearchParams(params).toString()

    // Fetch data & error check
    const res = await fetcher<LogFull>(`/api/game/${url}/log?${query}`)
    if (res.status === 204) return; // End of log
    if (res.status !== 200 || res.error || res.data?.total == null) {
      console.error(`LOG FETCH <${res.status}> ERROR:`, res.error)
      return setError(`Error <${res.status}> while fetching log.`)
    }

    // Update total
    const total = res.data.total,
      newEntries = offset == null && !isPreview ? res.data.log.toReversed() : res.data.log
    setTotal(total)

    // Update entries
    if (isPreview) return setPreview(newEntries.map(adaptEntry))

    const resOffset = res.data.offset ?? Math.max(0, total - newEntries.length)

    setEntries((log) => {
      log = { ...log }
      for (let i = 0; i < newEntries.length; i++) {
        log[i + resOffset] = adaptEntry(newEntries[i])
      }
      return log
    })

    setData(({ first, next }) => ({
      first: Math.max(resOffset + newEntries.length - 1, first),
      next: Math.max(total - resOffset, next),
    }))
  }, [url])

  // eslint-disable-next-line react-hooks/exhaustive-deps -- Debounce function
  const fetchLatest = useCallback(
    debounce(() => enabled && !error && fetchLogs(), combineInterval),
    [enabled, !error, fetchLogs, combineInterval]
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Debounce function
  const fetchOffset = useCallback(
    debounceGroup<number>((offsets) => enabled && !error && fetchLogs(toLogParams(offsets)), combineInterval),
    [enabled, !error, fetchLogs, combineInterval]
  )
  
  // Handle minor changes -- Reset cache on URL change, reload preview on filter change
  useEffect(() => { setEntries({}) }, [url])
  useEffect(() => {
    setPreview((preview) => {
      if (preview) fetchLogs({ options, players, actions, isPreview: true })
      return undefined
    })
  }, [logFilter, options, players, actions, fetchLogs])

  // Handle full reset
  useEffect(() => {
    setTotal(undefined)
    setPreview(undefined)
    setError(undefined)
    setData({ first: 0, next: 0 })
    if (url && enabled) fetchLogs({ options, players, actions, isPreview: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset when one of these changes
  }, [url, enabled, fetchLogs])
  
  // Get count of loaded + unfiltered
  const loaded = useMemo(() => {
    const count = Object.keys(entries).reduce((count, idx) => +logFilter(entries[idx]) + count, 0)

    if (count > (preview?.length ?? 0)) setPreview(undefined)
    return { ...data, count }
  }, [entries, logFilter, data, preview?.length])
  
  return {
    entries, total, preview, loaded,
    logFilter, fetchOffset, fetchLatest,
    allActions, allPlayers,
    error, setError,
    players, setPlayers,
    actions, setActions,
    options, setOptions,
    enabled, setEnabled,
  }
}

export type GameLog = ReturnType<typeof useGameLog>

export type FetchParams = {
  offset?: number, size?: number, isPreview?: boolean,
  options?: Partial<LogOptions>, players?: string[], actions?: LogAction[],
}