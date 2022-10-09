import type { ServerProps } from './game'
import { useState } from 'react'
import { useRouter } from 'next/router'
import useSocket from 'components/base/services/socket.controller'
import useLocalController from './local.controller'
import { initGameSocket, useGameEmitters } from './socket.controller'
import { INVALID_PATH } from 'assets/constants'

const socketEndpoint = (gameURL: any) => `/api/game/${typeof gameURL === 'string' ? gameURL : INVALID_PATH}/socket`

export default function useGameController(props: ServerProps) {
  const router = useRouter()
  const gameURL = typeof router.query.url === 'string' ? router.query.url : '_INVALID'

  const [landModal, setLandModal] = useState(false)
  const [hostModal, setHostModal] = useState(false)

  const local = useLocalController(props)

  const socket = useSocket(`/game/${gameURL}`, socketEndpoint(gameURL), initGameSocket(local))
  const { renamePlayer, nextRound, pickCard, swapCard, setLands } = useGameEmitters(local, socket)
  
  return {
    ...local,
    isConnected: socket.isConnected,
    renamePlayer, nextRound, pickCard, swapCard, setLands,

    landModal, hostModal,
    toggleLandModal: local.player?.basics ? () => setLandModal((o) => !o) : null,
    toggleHostModal: !local.game?.hostId || local.player?.id === local.game?.hostId ? (() => setHostModal((o) => !o)) : null,
  }
}