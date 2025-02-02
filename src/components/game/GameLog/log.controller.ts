import type { LogAction } from "@prisma/client"
import type { Game, BasicPlayer, LogFull } from "types/game"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "components/base/libs/storage"
import { fetcher } from "components/base/libs/fetch"
import { allActions, otherPlayers, filterLogs } from "./log.utils"
import { debounce } from "components/base/services/common.services"
import { logOptions } from "assets/constants"

const DEBOUNCE_DELAY = 500

export default function useGameLog(url: Game['url'], playerData: BasicPlayer[]) {
  const allPlayers = useMemo(() => playerData.map(({ id }) => id).concat(otherPlayers), [playerData])

  const [ logs,    setLog     ] = useState<LogFull>()
  const [ error,   setError   ] = useState<string>()
  const [ players, setPlayers ] = useState(allPlayers)
  const [ options, setOptions ] = useState(logOptions)
  const [ actions, setActions ] = useLocalStorage<LogAction[]>('logActions')
  const [ enabled, setEnabled ] = useState(false)

  const refresh = useCallback(debounce(() => {
    if (enabled) {
      fetcher<LogFull>(`/api/game/${url}/log`).then((res) => {
        if (res.status !== 200 || !res.data || res.error) {
          console.error(`LOG FETCH <${res.status}> ERROR:`, res.error)
          return setError(`Error <${res.status}> while fetching log.`)
        }
        setLog(res.data.map((entry) => ({ ...entry, time: new Date(entry.time) })))
        setError(undefined)
      })
    }
  }, DEBOUNCE_DELAY), [url, enabled])
  
  // Force refresh when enabled
  useEffect(() => { if (enabled) refresh() }, [enabled, refresh])
  
  return {
    list: filterLogs(logs, players, actions, options),
    allActions, allPlayers,
    error, setError, refresh,
    players, setPlayers,
    actions, setActions,
    options, setOptions,
    enabled, setEnabled,
  }
}

export type GameLog = ReturnType<typeof useGameLog>