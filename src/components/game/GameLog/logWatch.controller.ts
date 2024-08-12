import type { Game, LogAuthResponse } from "types/game"
import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"
import { post } from "components/base/libs/fetch"

export type SetNumber = Dispatch<SetStateAction<number>>

export default function useLogWatch(game?: Partial<Game>, refresh?: () => void, setLoading?: SetNumber) {
    const [authed, setAuth] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (password: string) => {
        setMessage("")
        if (!password || !game?.id) return;
        setLoading && setLoading((v) => v + 1)

        const res = await post<LogAuthResponse>(`/api/game/auth/${game?.id}`, { password })

        if (typeof res === 'number') {
            setMessage("Unable to reach server")
        } else if (res.success) {
            setAuth(true)
        } else {
            setMessage(res.message || "Unknown error")
        }
    
        setLoading && setLoading((v) => v - 1)
    }

    // Refresh log every 1 second (Easier than making a socket connection for now)
    useEffect(() => {
        if (authed && refresh) {
            const interval = setInterval(refresh, 1000)
            return () => clearInterval(interval)
        }
    }, [refresh, authed])

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