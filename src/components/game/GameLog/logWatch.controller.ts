import type { Game, LogAuthResponse } from "types/game"
import type { Dispatch, SetStateAction } from "react"
import type { ServerProps } from 'types/game'
import { useEffect, useState } from "react"
import { post } from "components/base/libs/fetch"
import useGameLog, { GameLog } from '../GameLog/log.controller'
import { getHolding } from '../shared/game.utils'



export type SetNumber = Dispatch<SetStateAction<number>>

export default function useLogWatch(log: GameLog, game?: Partial<Game>, sessionId?: string, setLoading?: SetNumber) {
    const [authed, setAuth] = useState(game?.watcher ? game.watcher === sessionId : false)
    const [message, setMessage] = useState("")

    // Check for change in auth
    useEffect(() => {
        if (log.error) { setAuth(false); setMessage(log.error) }
        else if (!game?.watcher) setAuth(false)
        else setAuth((a) => a || game.watcher === sessionId)
    }, [game?.watcher, sessionId, log.error])

    // Submit password
    const handleSubmit = async (password: string) => {
        setMessage("")
        if (!password || !game?.id) return;
        setLoading && setLoading((v) => v + 1)

        const res = await post<LogAuthResponse>(`/api/game/auth/${game?.id}`, { password })

        if (typeof res === 'number') {
            setMessage("Unable to reach server")
        } else if (res.success) {
            setAuth(true)
            log.setError(undefined)
            log.refresh()
        } else {
            setMessage(res.message || "Unknown error")
        }
    
        setLoading && setLoading((v) => v && v - 1)
    }

    // Refresh log every 1 second (Easier than making a socket connection for now)
    useEffect(() => {
        if (authed && log.refresh) {
            const interval = setInterval(log.refresh, 1000)
            return () => clearInterval(interval)
        }
    }, [log.refresh, authed])

    return { authed, message, handleSubmit }
}


export function useBasicGameController(props: ServerProps) {
    const [loadingAll,  setLoadingAll] = useState(0)
  
    const game = props.options
    const players = props.players || []
    const maxPackSize = props.packSize ?? 0
    
    const gameLog = useGameLog(game?.url ?? "", players)
  
    return {
      gameLog, loadingAll, setLoadingAll,
      game, players, maxPackSize,
      holding: getHolding(players, maxPackSize, game),
      sessionId: props.sessionId,
    }
  }