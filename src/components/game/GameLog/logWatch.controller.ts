import type { BasicPlayer, Game, LogAuthResponse } from "types/game"
import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"
import { post } from "components/base/libs/fetch"
import { GameLog } from '../GameLog/log.controller'

export type SetNumber = Dispatch<SetStateAction<number>>

export default function useLogWatch(log: GameLog, game?: Partial<Game>, players?: BasicPlayer[], sessionId?: string, setLoading?: SetNumber) {
    const [authed, setAuth] = useState(game?.watchId ? game.watchId === sessionId : false)
    const [message, setMessage] = useState("")

    // Check for change in auth
    useEffect(() => {
        if (log.error) { setAuth(false); setMessage(log.error) }
        else if (!game?.watchId) setAuth(false)
        else setAuth((a) => a || game.watchId === sessionId)
    }, [game?.watchId, sessionId, log.error])

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

    // Refresh log whenever the players array updates
    // eslint-disable-next-line react-hooks/exhaustive-deps -- just need log.refresh
    useEffect(() => { authed && log.refresh?.() }, [log.refresh, players, authed])

    return { authed, message, handleSubmit, logout: () => setAuth(false) }
}


