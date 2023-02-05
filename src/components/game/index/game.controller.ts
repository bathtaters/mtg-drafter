import type { PlayerFull, ServerProps, ServerSuccess } from 'types/game'
import type { LocalController } from './services/local.controller'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from 'components/base/libs/fetch'
import useSocket from 'components/base/libs/sockets'
import useAlerts, { AlertsReturn } from 'components/base/common/Alerts/alerts.hook'
import { useFocusEffect } from 'components/base/libs/hooks'
import useLocalController from './services/local.controller'
import { getGameListeners, useGameEmitters } from './services/socket.controller'
import downloadDeck from './services/downloadDeck.controller'
import useGameLog from '../LogModal/log.controller'
import { gameAPI, socketEndpoint } from 'assets/urls'
import { enableDropping, refreshOnRefocusDelay } from 'assets/constants'


export const reloadData = async ({ game, updateLocal }: Pick<LocalController, "game"|"updateLocal">, throwError: AlertsReturn['newError'], reconnect?: () => Promise<void>) => {
  try {
    if (!game?.url) throw new Error('There is no game at this URL')
    const res = await fetcher<ServerSuccess>(gameAPI(game?.url))
    if (typeof res === 'number') throw new Error(`Cannot update data: HTTP error ${res}`)
    updateLocal(res)
    if (reconnect) reconnect()

  } catch (err: any) {
    throwError({ message: err.message, title: 'Data Error', button: 'Refresh' })
  }
}


export default function useGameController(props: ServerProps) {
  const router = useRouter()
  const gameURL = typeof router.query.url === 'string' ? router.query.url : '_INVALID'

  const { ErrorComponent, ToastComponent, newError, newToast, clearError } = useAlerts()
  const [landModal, setLandModal] = useState(false)
  const [hostModal, setHostModal] = useState(false)
  const [logModal,  setLogModal ] = useState(false)

  const local = useLocalController(props, newError, newToast)
  const gameLog = useGameLog(gameURL, local.players)
  
  const toggleLandModal = !local.player?.basics ? undefined : () => setLandModal((o) => !o)
  const toggleHostModal = !local.isHost ? undefined : () => setHostModal((o) => {
    if (!o) gameLog.refresh()
    return !o
  })
  const toggleLogModal = !local.isHost ? undefined : () => setLogModal((o) => !o)

  const socket = useSocket(
    `/game/${gameURL}`,
    socketEndpoint(gameURL), getGameListeners(local, newError, clearError, gameLog.refresh, setHostModal),
    [local.game?.id, local.player?.id, gameLog.refresh],
    ({ message }) => newError({ title: 'Connection Error', message, button: 'Refresh' })
  )

  const { renamePlayer, setTitle, nextRound, pickCard, swapCard, setLands, setStatus } = useGameEmitters(local, socket, newError)

  const saveDeck = !local.player?.cards || !local.game ? undefined : () => { downloadDeck(local as Parameters<typeof downloadDeck>['0']) }
  
  useFocusEffect((focus) => { focus && reloadData(local, newError, socket.reconnect) }, [local.game?.id, newError, socket.reconnect], refreshOnRefocusDelay)

  return {
    ...local, gameLog,
    isConnected: socket.isConnected,
    renamePlayer, setTitle, nextRound, pickCard, swapCard, setLands, setStatus,
    newError, newToast, ErrorComponent, ToastComponent,

    landModal, hostModal, logModal, saveDeck,
    toggleLandModal, toggleHostModal, toggleLogModal,
    dropPlayer: enableDropping && local.player ? () => setStatus((local.player as PlayerFull).id, 'leave') : undefined,
    reload: local.game?.url ? local.reload : undefined,
  }
}