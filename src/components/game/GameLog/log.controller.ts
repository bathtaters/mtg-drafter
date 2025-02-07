import type { LogAction } from "@prisma/client"
import type { Game, BasicPlayer, LogFull, LogEntryFull } from "types/game"
import type { LogFilterParam } from "types/log.validation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "components/base/libs/storage"
import { fetcher } from "components/base/libs/fetch"
import { type FetchHandler, useDynamicScrollFetcher } from "components/base/libs/scrollFetch"
import { adaptEntry, filterEntry } from "./log.utils"
import { logOptions, logFetchOptions, dynamicScrollPreloadDistancePx } from "assets/constants"
import { allActions, otherPlayers } from "types/logs"


export default function useGameLog(url: Game['url'], playerData: BasicPlayer[]) {
  const allPlayers = useMemo(() => playerData.map(({ id }) => id).concat(otherPlayers), [playerData])
  const [ players, setPlayers ] = useState(allPlayers)
  const [ options, setOptions ] = useState(logOptions)
  const [ actions, setActions ] = useLocalStorage<LogAction[]>('logActions')

  const filter = useCallback((entry?: LogEntryFull) => filterEntry(entry, players, actions, options), [players, actions, options])

  const fetchLogs = useCallback<FetchHandler<LogEntryFull, LogParams>>(async (query, params) => {
    const res = await fetcher<LogFull>(`/api/game/${url}/log?${query}`)
    if (res.status === 204) return; // End of log
    if (res.status !== 200 || res.error || res.data?.total == null) return { error: `Error <${res.status}> while fetching log.` }

    const data = params.offset == null && !params.isPreview ? res.data.log.toReversed() : res.data.log
    return { data: data.map(adaptEntry), total: res.data.total, offset: res.data.offset }
  }, [url])

  const {
    entries, fetch, reset,
    enabled, setEnabled,
    error, setError,
    scrollParentRef, scrollItemProps, 
  } = useDynamicScrollFetcher(fetchLogs, { filter, initalEnabled: false, scrollMarginPxls: dynamicScrollPreloadDistancePx, ...logFetchOptions })
  
  // Handle minor changes -- Reset cache on URL change, reload preview on filter change
  useEffect(() => { reset(true) }, [url, reset])
  useEffect(() => { reset(false) }, [enabled, reset])
  useEffect(() => { fetch({ filter: { ...options, players, actions }, isPreview: true }) }, [options, players, actions, fetch])
  
  return {
    entries, fetch, reset,
    allActions, allPlayers,
    error, setError,
    players, setPlayers,
    actions, setActions,
    options, setOptions,
    enabled, setEnabled,
    scrollParentRef, scrollItemProps,
  }
}

export type GameLog = ReturnType<typeof useGameLog>

export type LogParams = { offset?: number, size?: number, isPreview?: boolean, filter?: LogFilterParam }