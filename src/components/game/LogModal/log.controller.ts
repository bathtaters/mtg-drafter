import type { Game, Player } from "@prisma/client"
import type { LogFull } from "types/game"
import { useCallback, useMemo, useState } from "react"
import { fetcher } from "components/base/libs/fetch"
import { actionBase, additionalPlayers, filterLogs } from "./log.utils"
import { debounce } from "components/base/libs/utils"
import { logOptions } from "assets/constants"

const DEBOUNCE_DELAY = 500

export default function useGameLog(url: Game['url'], playerData: Player[]) {
  const playerBase = useMemo(() => playerData.map(({ id }) => id).concat(additionalPlayers), [playerData.length])

  const [ logs,    setLog     ] = useState<LogFull>()
  const [ error,   setError   ] = useState<string>()
  const [ players, setPlayers ] = useState(playerBase)
  const [ actions, setActions ] = useState(actionBase)
  const [ options, setOptions ] = useState(logOptions)

  const refresh = useCallback(debounce(() => {

    fetcher<LogFull>(`/api/game/${url}/log`).then((data) => {
      if (typeof data === 'number') return setError(`Error <${data}> while fetching log.`)
      setLog(data.map((entry) => ({ ...entry, time: new Date(entry.time) })))
      setError(undefined)
    })

  }, DEBOUNCE_DELAY), [url])
  
  
  
  return {
    list: filterLogs(logs, players, actions, options),
    actionBase, playerBase,
    error, refresh,
    players, setPlayers,
    actions, setActions,
    options, setOptions,
  }
}

export type GameLog = ReturnType<typeof useGameLog>