import type { ServerProps } from './game'
import { useState } from 'react'
import { useRouter } from 'next/router'
import useSocket from 'components/base/services/socket.controller'
import useLocalController from './local.controller'
import { getGameListeners, useGameEmitters } from './socket.controller'
import downloadDeck from './downloadDeck.controller'
import { socketEndpoint } from 'assets/urls'
import { FullGame } from 'assets/strings'


export default function useGameController(props: ServerProps) {
  const router = useRouter()
  const gameURL = typeof router.query.url === 'string' ? router.query.url : '_INVALID'

  const [landModal, setLandModal] = useState(false)
  const [hostModal, setHostModal] = useState(false)

  const local = useLocalController(props)

  const socket = useSocket(`/game/${gameURL}`, socketEndpoint(gameURL), getGameListeners(local))
  const { renamePlayer, nextRound, pickCard, swapCard, setLands, setStatus } = useGameEmitters(local, socket)

  const saveDeck = !local.player?.cards || !local.game ? null : () => { downloadDeck(local as Parameters<typeof downloadDeck>['0']) }
  
  return {
    ...local,
    isConnected: socket.isConnected,
    loadingMessage: !local.player && !local.slots.length ? FullGame : undefined,
    renamePlayer, nextRound, pickCard, swapCard, setLands, setStatus,

    landModal, hostModal, saveDeck,
    toggleLandModal: local.player?.basics ? () => setLandModal((o) => !o) : null,
    toggleHostModal: !local.game?.hostId || local.player?.id === local.game?.hostId ? (() => setHostModal((o) => !o)) : null,
  }
}