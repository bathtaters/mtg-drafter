import type { GameClient } from 'backend/controllers/game.socket.d'
import type { LocalController } from './local.controller'
import type { PlayerFull, Socket } from './game'
import { useEffect } from 'react'
import { debugSockets } from 'assets/constants'


export function getGameListeners({ renamePlayer, nextRound, otherPick, setStatus, player }: LocalController) {
  return (socket: GameClient) => {

    socket.on('updateName',  (playerId, name) => { 
      debugSockets && console.debug('SOCKET','updateName',playerId,name)
      name && renamePlayer(playerId, name)
    })
    socket.on('updatePick',  (playerId, pick) => {
      debugSockets && console.debug('SOCKET','updatePick',playerId,pick)
      otherPick(playerId, pick)
    })
    socket.on('updateRound', (round) => {
      debugSockets && console.debug('SOCKET','updateRound',round)
      nextRound(round)
    })
    socket.on('updateSlot', (playerId, sessionId) => {
      debugSockets && console.debug('SOCKET','updateSlot',playerId,sessionId)
      setStatus(playerId, sessionId, playerId === player?.id)
    })

    return () => {
      socket.removeAllListeners('updateName')
      socket.removeAllListeners('updatePick')
      socket.removeAllListeners('updateRound')
    }
  }
}


export function useGameEmitters(local: LocalController, { socket, isConnected }: { socket: GameClient | null, isConnected: boolean }) {
  
  const renamePlayer: Socket.RenamePlayer = (name) => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!local.player) return console.error('Player not loaded')

    name && local.renamePlayer(local.player.id, name)
    socket.emit('setName', name)
  }

  const nextRound: Socket.NextRound = () => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!local.game) return console.error('Game not loaded')

    local.setLoadingPack(true)
    socket.emit('nextRound', local.game.round + 1)
  }

  const pickCard: Socket.PickCard = (cardIdx) => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!local.pack) return console.error('Player does not have a pack')

    local.setLoadingPack(true)
    const gameCardId = local.pack.cards[cardIdx].id
    socket.emit('pickCard', gameCardId, (pick) => {
      if (typeof pick === 'number') local.pickCard(pick, gameCardId)
    })
  }

  const getPack: Socket.GetPack = () => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!local.packs[local.packIdx]) return console.error('Pack not available')

    local.setLoadingPack(true)
    socket.emit('getPack', local.packs[local.packIdx].id, (pickableIds) => {
      local.setNextPack(pickableIds)
    })
  }
  useEffect(() => { if (local.packIdx >= 0) getPack() }, [local.packIdx, local.player?.pick])


  const swapCard: Socket.SwapCard = (cardId, board) => {
    if (!socket || !isConnected) return console.error('Not connected to server')

    local.swapCard(cardId, board)
    socket.emit('swapBoards', cardId, board, (cardId, board) => {
      local.swapCard(cardId, board)
    })
  }

  const setLands: Socket.SetLands = (lands) => {
    if (!socket || !isConnected) return console.error('Not connected to server')

    local.setLands(lands)
    socket.emit('setLands', lands, (lands) => { local.setLands(lands) })
  }

  const setStatus: Socket.SetStatus = (playerId, status = 'join') => {
    if (!socket || !isConnected) return console.error('Not connected to server')

    local.setLoadingAll(true)
    local.setStatus(playerId, status === 'join' ? '_temp' : null, true)
    socket.emit('setStatus', playerId, status, (player) => {
      if (player?.id && player.sessionId && 'cards' in player) local.updatePlayer(player)
      local.setStatus(player?.id || playerId, player?.sessionId || null, true)
    })
  }

  return { renamePlayer, nextRound, pickCard, getPack, swapCard, setLands, setStatus }
}


export type SocketController = ReturnType<typeof useGameEmitters>
