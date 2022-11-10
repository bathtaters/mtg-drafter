import type { GameClient } from 'backend/controllers/game.socket.d'
import type { LocalController } from './local.controller'
import type { Socket } from 'types/game'
import { useEffect } from 'react'
import { debugSockets } from 'assets/constants'

const reloadData = () => { console.error("RELOAD PAGE - TBD") }

export function getGameListeners({ updateGame, updatePlayer, renamePlayer, nextRound, otherPick, setStatus, player }: LocalController) {
  return (socket: GameClient) => {

    socket.on('updateTitle',  (title) => { 
      debugSockets && console.debug('SOCKET','updateTitle',title)
      title && updateGame((game) => game && ({ ...game, name: title }))
    })
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
      console.log(playerId, player, sessionId)
      setStatus(playerId, sessionId)
    })

    return () => {
      socket.removeAllListeners('updateName')
      socket.removeAllListeners('updatePick')
      socket.removeAllListeners('updateRound')
    }
  }
}


export function useGameEmitters(local: LocalController, { socket, isConnected }: { socket: GameClient | null, isConnected: boolean }) {
  
  const renamePlayer: Socket.RenamePlayer = (name, playerId) => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!local.player) return console.error('Player not loaded')

    name && local.renamePlayer(playerId || local.player.id, name)
    socket.emit('setName', playerId || local.player.id, name)
  }

  const setTitle: Socket.SetTitle = (title) => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!local.game) return console.error('Game not loaded')

    title && local.updateGame((game) => game && ({ ...game, name: title }))
    socket.emit('setTitle', local.game.id, title)
  }

  const nextRound: Socket.NextRound = () => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!local.game) return console.error('Game not loaded')

    local.setLoadingPack((v) => v + 1)
    socket.emit('nextRound', local.game.id, local.game.round + 1)
  }

  const pickCard: Socket.PickCard = (cardIdx) => {
    if (!socket || !isConnected || !local.player) return console.error('Not connected to server')
    if (!local.pack) return console.error('Player does not have a pack')

    local.setLoadingPack((v) => v + 1)
    const gameCardId = local.pack.cards[cardIdx].id
    socket.emit('pickCard', local.player.id, gameCardId, (pick) => {
      if (typeof pick !== 'number') return reloadData()
      local.pickCard(pick, gameCardId)
    })
  }

  const getPack: Socket.GetPack = (packId) => {
    if (!socket || !isConnected) return console.error('Not connected to server')
    if (!packId) return console.error('Pack not available')

    local.setLoadingPack((v) => v + 1)
    socket.emit('getPack', packId, (pickableIds) => {
      local.setNextPack(pickableIds || undefined)
    })
  }
  useEffect(() => {
    const packId = local.packs[local.packIdx]?.id
    packId ? getPack(packId) : local.setNextPack(undefined)
  }, [local.packIdx, local.player?.pick])


  const swapCard: Socket.SwapCard = (cardId, board) => {
    if (!socket || !isConnected) return console.error('Not connected to server')

    local.swapCard(cardId, board)
    socket.emit('swapBoards', cardId, board, (cardId, board) => {
      if (!cardId) return reloadData()
      local.swapCard(cardId, board)
    })
  }

  const setLands: Socket.SetLands = (lands) => {
    if (!socket || !isConnected || !local.player) return console.error('Not connected to server')

    local.setLands(lands)
    socket.emit('setLands', local.player.id, lands, (lands) => {
      if (!lands) return reloadData()
      local.setLands(lands)
    })
  }

  const setStatus: Socket.SetStatus = (playerId, status = 'join') => {
    if (!socket || !isConnected) return console.error('Not connected to server')

    local.setLoadingAll((v) => v + 1)
    socket.emit('setStatus', playerId, status, (player) => {
      if (!player) return reloadData()
      if (player.id && player.sessionId && local.sessionId === player.sessionId && 'cards' in player) local.updatePlayer(player)
      local.setStatus(player.id, player.sessionId || null)
    })
  }

  return { renamePlayer, setTitle, nextRound, pickCard, getPack, swapCard, setLands, setStatus }
}


export type SocketController = ReturnType<typeof useGameEmitters>
