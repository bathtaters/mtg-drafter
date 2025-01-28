import type { Game, LogAuthResponse } from "types/game"
import type { Dispatch, SetStateAction } from "react"
import type { Props as LogProps } from "./GameLog"
import { useEffect, useState } from "react"
import { post } from "components/base/libs/fetch"
import { canWatch } from "../shared/game.utils"

export type Props = LogProps & {
    game?: Partial<Game>,
    setLoading?: SetNumber,
    sessionId?: string,
    reload?: () => any,
    sidebarVisible: boolean,
    setSidebar?: Dispatch<SetStateAction<boolean>>,
}

export default function useLogWatch({ log, players, game, sessionId, setLoading, reload, setSidebar }: Props) {
    const [authed, setAuth] = useState(canWatch(game, sessionId))
    const [message, setMessage] = useState("")

    // Check for change in auth
    const watchIdString = (game?.watchIds || []).join(',')
    useEffect(() => {
        if (log.error) { setAuth(false); setMessage(log.error) }
        else if (!game?.watchIds || !game?.watchKey) setAuth(false)
        else setAuth((a) => a || canWatch(game, sessionId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchIdString, game?.watchKey, sessionId, log.error])

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

    // Refresh log whenever the players array updates -- Logout if player has joined
    useEffect(() => {
        authed && log.refresh?.()
        if (
            ((game?.round ?? 0) <= (game?.roundCount ?? 1)) &&
            players.find((p) => sessionId == p.sessionId)
        ) setAuth(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- just need log.refresh
    }, [log.refresh, players, authed, sessionId])

    // Refresh header/sidebar when authorization updates
    useEffect(() => {
        authed && reload?.()
        !authed && setSidebar?.(false)
    }, [reload, setSidebar, authed])

    return { authed, message, handleSubmit, logout: () => setAuth(false) }
}

type SetNumber = Dispatch<SetStateAction<number>>