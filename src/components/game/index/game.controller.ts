import type { ServerProps, ServerSuccess } from 'types/game'
import type { LocalController } from './services/local.controller'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from 'components/base/services/fetch.services'
import useSocket from 'components/base/services/socket.controller'
import useLocalController from './services/local.controller'
import { getGameListeners, useGameEmitters } from './services/socket.controller'
import downloadDeck from './services/downloadDeck.controller'
import { gameAPI, socketEndpoint } from 'assets/urls'
import { FullGame } from 'assets/strings'


export const reloadData = async ({ game, updateLocal }: Pick<LocalController, "game"|"updateLocal">) => {
  if (!game?.url) return console.error('Cannot update data: Missing GAME URL')
  const res = await fetcher<ServerSuccess>(gameAPI(game?.url))
  if (typeof res === 'number') return console.error(`Cannot update data: API error ${res}`)
  updateLocal(res)
}


export default function useGameController(props: ServerProps) {
  const router = useRouter()
  const gameURL = typeof router.query.url === 'string' ? router.query.url : '_INVALID'

  const [landModal, setLandModal] = useState(false)
  const [hostModal, setHostModal] = useState(false)

  const local = useLocalController(props)

  const socket = useSocket(`/game/${gameURL}`, socketEndpoint(gameURL), getGameListeners(local), [local.game?.id, local.player?.id])

  const { renamePlayer, setTitle, nextRound, pickCard, swapCard, setLands, setStatus } = useGameEmitters(local, socket)

  const saveDeck = !local.player?.cards || !local.game ? null : () => { downloadDeck(local as Parameters<typeof downloadDeck>['0']) }
  
  return {
    ...local,
    isConnected: socket.isConnected,
    loadingMessage: !local.player && !local.slots.length ? FullGame : undefined,
    renamePlayer, setTitle, nextRound, pickCard, swapCard, setLands, setStatus,

    landModal, hostModal, saveDeck,
    toggleLandModal: local.player?.basics ? () => setLandModal((o) => !o) : null,
    toggleHostModal: !local.game?.hostId || local.player?.id === local.game?.hostId ? (() => setHostModal((o) => !o)) : null,
  }
}