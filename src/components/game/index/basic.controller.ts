import type { ServerProps, ServerSuccess } from 'types/game'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { fetcher } from 'components/base/libs/fetch'
import useSocket from 'components/base/libs/sockets'
import useAlerts, { AlertsReturn } from 'components/base/common/Alerts/alerts.hook'
import { useFocusEffect } from 'components/base/libs/hooks'
import useLocalController, { LocalController } from './services/local.controller'
import { getGameListeners } from './services/socket.controller'
import useGameLog from 'components/game/GameLog/log.controller'
import { gameAPI, gameURL, socketEndpoint } from 'assets/urls'
import { refreshOnRefocusDelay } from 'assets/constants'


export default function useBasicGameController(props: ServerProps, setHostModal?: Dispatch<SetStateAction<boolean>>) {
  const url = props.options?.url ?? '_INVALID'

  const [ sidebarVisible, setSidebar ] = useState(false)

  const { newError, newToast, clearError, ...alerts } = useAlerts()

  const local = useLocalController(props, newError, newToast)
  const gameLog = useGameLog(url, local.players)

  const socket = useSocket(
    gameURL(url),
    socketEndpoint(url),
    getGameListeners(local, newError, clearError, gameLog.refresh, setHostModal),
    [local.game?.id, local.player?.id, gameLog.refresh],
    ({ message }) => newError({ title: 'Connection Error', message, button: 'Refresh' })
  )
  
  useFocusEffect(
    (focus) => { focus && reloadData(local.game?.url, local.updateLocal, newError, socket.reconnect) },
    [local.game?.url, local.updateLocal, newError, socket.reconnect], refreshOnRefocusDelay
  )

  return {
    ...local, ...alerts, socket,
    sidebarVisible, setSidebar,
    gameLog, newError, newToast,
    isConnected: socket.isConnected,
    reload: local.game?.url ? local.reload : undefined,
  }
}

export type BasicController = ReturnType<typeof useBasicGameController>


export async function reloadData(
    url: string | undefined,
    updateLocal: LocalController["updateLocal"],
    throwError: AlertsReturn['newError'],
    reconnect?: () => Promise<void>
) {
    try {
        if (!url) throw new Error('There is no game at this URL')
        const res = await fetcher<ServerSuccess>(gameAPI(url))
        if (typeof res === 'number') throw new Error(`Cannot update data: HTTP error ${res}`)
        updateLocal(res)
        if (reconnect) reconnect()

    } catch (err: any) {
        throwError({ message: err.message, title: 'Data Error', button: 'Refresh' })
    }
}
