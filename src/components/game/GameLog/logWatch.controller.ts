import type { Dispatch, SetStateAction } from "react"
import type { Game } from "types/game"
import type { Props as LogProps } from "./GameLog"
import type { SocketHook } from "components/base/libs/sockets"
import type { ErrorAlert } from "components/base/common/Alerts/alerts.d"
import type { GameClient, GameServerToClient } from "backend/controllers/game.socket.d"
import { useCallback, useEffect, useState } from "react"
import { gameIsEnded } from "../shared/game.utils"
import { noPwMsg } from "assets/strings"

export type Props = LogProps & {
    game?: Partial<Game>,
    socket: SocketHook<GameClient>,
    setLoading?: SetNumber,
    sessionId?: string,
    reload?: () => any,
    sidebarVisible: boolean,
    setSidebar?: Dispatch<SetStateAction<boolean>>,
    newError: (alert: ErrorAlert) => any,
}

export default function useLogWatch({
    log: { setEnabled, setError, fetch, error },
    game, socket, sessionId, setLoading, reload, setSidebar, newError
}: Props) {
    const [authed, setAuthState] = useState(false)
    const [message, setMessage] = useState("")
    const gameEnded = gameIsEnded(game)

    // Trigger actions when user logs in/out
    const setAuth = useCallback((authed: boolean) => {
        if (authed) reload?.()
        else setSidebar?.(false)

        setEnabled(authed)
        setAuthState(authed)
    }, [reload, setSidebar, setEnabled])

    // Check if user is already logged in on first load or if game/session changes
    useEffect(() => {
        if (socket.socket && socket.isConnected && game?.id && sessionId) {
            socket.socket.emit('watcherLogin', game.id, sessionId, null, (success, reason) => {
                setAuth(success)
                if (reason && reason !== noPwMsg) setMessage(reason)
            })
        }
    }, [socket.socket, socket.isConnected, game?.id, sessionId, setAuth])

    // Login/Logout handlers

    const login = (password: string) => {
        if (!sessionId) return setMessage("User token missing")
        setMessage("")
        if (!game?.id || !password) return;
        if (!socket.isConnected) return setMessage("Unable to reach server")

        setLoading && setLoading((v) => v + 1)

        socket.emit('watcherLogin', game.id, sessionId, password, (success: boolean, reason?: string) => {
            setAuth(success)
            setError(undefined)
            if (success) fetch()
            else setMessage(reason || "Unknown error")
            setLoading && setLoading((v) => v && v - 1)
        })
    }

    const logout = () => {
        if (!game?.id || !sessionId || !socket.isConnected) return newError({
            title: 'Logout Failed', theme: "warning",
            message: !game?.id ? "Game not found" : !sessionId ? "User token missing" : "Unable to reach server",
        })
        socket.emit('dropWatcher', game.id, sessionId, false)
    }

    // Add watcher-specific socket listeners
    useEffect(() => {
        if (!socket.socket) return;

        const updateWatcher: GameServerToClient['updateWatcher'] = (session, joined, _) =>
            session === sessionId && setAuth(joined)
        const updateBan: GameServerToClient['updateBan'] = ({ sessionId: session, unban }) =>
            !unban && session === sessionId && setAuth(false)
        const updateWatchPw: GameServerToClient['updateWatchPw'] = (watchKey) =>
            !watchKey && setAuth(false)

        socket.socket.on('updateWatcher', updateWatcher)
        socket.socket.on('updateWatchPw', updateWatchPw)
        socket.socket.on('updateBan', updateBan)

        return () => {
            if (!socket.socket) return;
            socket.socket.off('updateWatcher', updateWatcher)
            socket.socket.off('updateWatchPw', updateWatchPw)
            socket.socket.off('updateBan', updateBan)
        }
    }, [socket.socket, game?.id, sessionId, gameEnded, setAuth])

    // Handle log errors
    useEffect(() => {
        if (error) {
            setAuth(false)
            setMessage((msg) => msg || error || "")
        } 
    }, [setAuth, error])

    return { authed, message, login, logout }
}

type SetNumber = Dispatch<SetStateAction<number>>