import type { Game, LogEntry } from "@prisma/client"
import type { LogFull } from "types/game"
import { useCallback, useState } from "react"
import { fetcher } from "components/base/libs/fetch"
import { debounce, filterLogs, PlayerFilter } from "./log.utils"

const DEBOUNCE_DELAY = 500

export default function useGameLog(url: Game['url']) {
  const [ logs,    setLog     ] = useState<LogFull>()
  const [ error,   setError   ] = useState<string>()
  const [ players, setPlayers ] = useState<PlayerFilter[]>()
  const [ actions, setActions ] = useState<LogEntry['action'][]>()

  const refresh = useCallback(debounce(() => {

    fetcher<LogFull>(`/api/game/${url}/log`).then((data) => {
      if (typeof data === 'number') return setError(`Error <${data}> while fetching log.`)
      setLog(data)
      setError(undefined)
    })

  }, DEBOUNCE_DELAY), [url])
  
  return {
    list: filterLogs(logs, players, actions),
    error, refresh,
    players, setPlayers,
    actions, setActions,
  }
}

export type GameLog = ReturnType<typeof useGameLog>