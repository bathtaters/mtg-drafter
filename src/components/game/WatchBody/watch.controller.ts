import type { Dispatch, SetStateAction } from "react"
import type { BasicPlayer, Game, PackFull } from "types/game"
import type { Props as LogProps } from "../GameLog/GameLog"
import type { SocketHook } from "components/base/libs/sockets"
import type { ErrorAlert } from "components/base/common/Alerts/alerts.d"
import type { GameClient, GameServerToClient } from "backend/controllers/game.socket.d"
import { useCallback, useEffect, useState } from "react"
import Router from "next/router"
import { hashText } from "components/base/libs/encrypt"
import { WatcherTabs } from "types/game"
import usePackViewer from "../PackViewer/packViewer.controller"
import { useTabController } from "../GameBody/pick.controller"
import { gameIsEnded } from "../shared/game.utils"
import { noPwMsg } from "assets/strings"
import { shareGame, shareWatch } from "assets/constants"


export type Props = {
    gameLog: LogProps['gameLog'],
    game?: Partial<Game>,
    players?: BasicPlayer[],
    packs?: PackFull[],
    socket: SocketHook<GameClient>,
    setLoadingAll?: Set<number>,
    sessionId?: string,
    isHost?: boolean,
    hasJoined?: boolean,
    hasViewed?: boolean,
    reload?: () => any,
    onPackView?: () => any,
    setSidebar?: Set<boolean>,
    newError: (alert: ErrorAlert) => any,
}


export default function useWatchController({
    gameLog: { setEnabled, setError, fetch, error },
    game, players, packs, socket, sessionId, isHost, hasJoined, hasViewed,
    onPackView, setSidebar, reload, setLoadingAll, newError,
}: Props, noChildren: boolean) {
    const [authed, setAuthState] = useState(false)
    const [message, setMessage] = useState("")
    const gameEnded = gameIsEnded(game)
    const watchDisabled = !game?.watchKey

    const tabProps = useTabController<WatcherTabs>(isHost && !hasViewed ? WatcherTabs.join : WatcherTabs.log, game, players, false)
    const packViewData = usePackViewer(packs, tabProps.pickInfo?.data, players, game, sessionId, socket.socket, onPackView, newError)

    // Trigger actions when user logs in/out
    const setAuth = useCallback((authed: boolean) => {
        if (authed) reload?.()
        else setSidebar?.(false)

        setEnabled(authed)
        setAuthState(authed)
    }, [reload, setSidebar, setEnabled])

    // Check if user is already logged in on first load or if game/session changes
    useEffect(() => {
        if (isHost) {
            if(game?.url && Router.pathname.startsWith(shareWatch.url('')))
                Router.push(shareGame.url(game.url)) // Redirect hosts to Host page
            fetch()
            return setAuth(true)

        } else if (socket.socket && socket.isConnected && game?.id && sessionId) {
            socket.socket.emit('watcherLogin', game.id, sessionId, null, (success, reason) => {
                setAuth(success)
                if (reason && reason !== noPwMsg) setMessage(reason)
            })
        }
    }, [game?.url, isHost, socket.socket, socket.isConnected, game?.id, sessionId, setAuth, fetch])

    // Login/Logout handlers

    const login = async (password: string) => {
        if (isHost) return setAuth(true)
        if (!sessionId) return setMessage("User token missing")
        setMessage("")
        if (!game?.id || !password) return;
        if (!socket.isConnected) return setMessage("Unable to reach server")

        setLoadingAll && setLoadingAll((v) => v + 1)

        const encrypted = await hashText(password)
        socket.emit('watcherLogin', game.id, sessionId, encrypted, (success: boolean, reason?: string) => {
            setAuth(success)
            setError(undefined)
            if (success) fetch()
            else setMessage(reason || "Unknown error")
            setLoadingAll && setLoadingAll((v) => v && v - 1)
        })
    }

    const logout = isHost ? undefined : () => {
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

    const hideTabs = !isHost || noChildren || hasViewed ? [WatcherTabs.join] : []
    if (hasJoined) hideTabs.push(WatcherTabs.cards)

    return {
        watchDisabled, authed, message, login, logout, packViewData, hideTabs,
        ...tabProps
    }
}


type Set<T> = Dispatch<SetStateAction<T>>
export type WatchController = ReturnType<typeof useWatchController>