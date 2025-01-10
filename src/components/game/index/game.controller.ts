import type { PlayerFull, ServerProps } from 'types/game'
import { useState } from 'react'
import { useGameEmitters } from './services/socket.controller'
import downloadDeck from './services/downloadDeck.controller'
import { enableDropping } from 'assets/constants'
import useBasicGameController from './basic.controller'


export default function useGameController(props: ServerProps) {
  const [landModal, setLandModal] = useState(false)
  const [hostModal, setHostModal] = useState(false)
  const [logModal,  setLogModal ] = useState(false)

  const local = useBasicGameController(props, setHostModal)
  
  const toggleLandModal = !local.player?.basics ? undefined : () => setLandModal((o) => !o)
  const toggleHostModal = !local.isHost ? undefined : () => setHostModal((o) => {
    if (!o) local.gameLog.refresh()
    return !o
  })
  const toggleLogModal = !local.isHost ? undefined : () => setLogModal((o) => !o)

  const { renamePlayer, setTitle, nextRound, pauseGame, pickCard, swapCard, setLands, setStatus, setWatchPw } = useGameEmitters(local, local.newError)

  const saveDeck = !local.player?.cards || !local.game ? undefined : () => { downloadDeck(local as Parameters<typeof downloadDeck>['0']) }

  return {
    ...local,
    renamePlayer, setTitle, nextRound, pauseGame, pickCard, swapCard, setLands, setStatus, setWatchPw,
    
    landModal, hostModal, logModal, saveDeck,
    toggleLandModal, toggleHostModal, toggleLogModal,
    dropPlayer: enableDropping && local.player ? () => setStatus((local.player as PlayerFull).id, 'leave') : undefined,
  }
}