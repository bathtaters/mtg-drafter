import type { LogAction } from "@prisma/client"
import type { Game, BasicPlayer, LogFull, LogList } from "types/game"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "components/base/libs/storage"
import { fetcher } from "components/base/libs/fetch"
import { allActions, otherPlayers, filterEntryBuilder, adaptEntry, toLogParams } from "./log.utils"
import { debounce, debounceGroup } from "components/base/services/common.services"
import { logOptions, logFetchOptions } from "assets/constants"

/** NOTE: This will handle combining queries but not caching. */
export default function useGameLog(url: Game['url'], playerData: BasicPlayer[], combineInterval = logFetchOptions.combineInterval) {
  const allPlayers = useMemo(() => playerData.map(({ id }) => id).concat(otherPlayers), [playerData])

  const [ logs,    setLog     ] = useState<LogList>({})
  const [ size,    setSize    ] = useState<number>()
  const [ error,   setError   ] = useState<string>()
  const [ players, setPlayers ] = useState(allPlayers)
  const [ options, setOptions ] = useState(logOptions)
  const [ actions, setActions ] = useLocalStorage<LogAction[]>('logActions')
  const [ enabled, setEnabled ] = useState(false)

  const logFilter = useCallback(filterEntryBuilder(players, actions, options), [players, actions, options])

  const fetchLogs = useCallback(async (offset?: number, size = logFetchOptions.defaultSize) => {
    const query = offset == null ? "" : new URLSearchParams({ offset: offset.toString(), size: size.toString() }).toString()

    const res = await fetcher<LogFull>(`/api/game/${url}/log?${query}`)
    if (res.status === 204) return; // End of log
    if (res.status !== 200 || res.error || res.data?.total == null) {
      console.error(`LOG FETCH <${res.status}> ERROR:`, res.error)
      return setError(`Error <${res.status}> while fetching log.`)
    }

    // Update total
    const total = res.data.total,
      newEntries = offset == null ? res.data.log.toReversed() : res.data.log
    setSize(total)

    // Update data
    const resOffset = res.data.offset ?? Math.max(0, total - newEntries.length)
    setLog((log) => {
      log = { ...log }
      for (let i = 0; i < newEntries.length; i++) {
        log[i + resOffset] = adaptEntry(newEntries[i])
      }
      return log
    })
  }, [url])

  const fetchLatest = useCallback(
    debounce(() => enabled && !error && fetchLogs(), combineInterval),
    [enabled, !error, fetchLogs, combineInterval]
  )
  const fetchOffset = useCallback(
    debounceGroup<number>((offsets) => enabled && !error && fetchLogs(...toLogParams(offsets)), combineInterval),
    [enabled, !error, fetchLogs, combineInterval]
  )
  
  // Handle overall state changes
  useEffect(() => {
    if (enabled && !error) fetchLatest()
    else if (!enabled) setSize(undefined)
  }, [enabled, !error, fetchLatest])

  useEffect(() => { url && setLog({}) }, [url])
  
  return {
    list: logs, size, logFilter,
    fetchOffset, fetchLatest,
    allActions, allPlayers,
    error, setError,
    players, setPlayers,
    actions, setActions,
    options, setOptions,
    enabled, setEnabled,
  }
}

export type GameLog = ReturnType<typeof useGameLog>