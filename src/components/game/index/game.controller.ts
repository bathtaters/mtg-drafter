import type { Player } from '@prisma/client'
import type { ServerProps, ServerSuccess } from 'types/game'
import type { LocalController } from './services/local.controller'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from 'components/base/services/fetch.services'
import useSocket from 'components/base/services/socket.controller'
import { useFocusEffect } from 'components/base/services/common.services'
import useLocalController from './services/local.controller'
import { getGameListeners, useGameEmitters } from './services/socket.controller'
import downloadDeck from './services/downloadDeck.controller'
import { gameAPI, socketEndpoint } from 'assets/urls'
import { enableDropping, refreshOnRefocusDelay } from 'assets/constants'


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

  const saveDeck = !local.player?.cards || !local.game ? undefined : () => { downloadDeck(local as Parameters<typeof downloadDeck>['0']) }
  
  useFocusEffect((focus) => { focus && reloadData(local) }, [local.game?.id], refreshOnRefocusDelay)

  return {
    ...local,
    isConnected: socket.isConnected,
    renamePlayer, setTitle, nextRound, pickCard, swapCard, setLands, setStatus,

    landModal, hostModal, saveDeck,
    toggleLandModal: local.player?.basics ? () => setLandModal((o) => !o) : undefined,
    toggleHostModal: local.isHost ? (() => setHostModal((o) => !o)) : undefined,
    dropPlayer: enableDropping && local.player ? () => setStatus((local.player as Player).id, 'leave') : undefined
  }
}