import type { Game } from '@prisma/client'
import type { GameClient } from 'backend/controllers/game.socket.d'
import type { LocalController } from './local.controller'
import type { Socket } from 'types/game'
import { useCallback } from 'react'
import { debugSockets } from 'assets/constants'
import { reloadData } from '../game.controller'

export function getGameListeners({ updateLocal, updateGame, renamePlayer, nextRound, pickCard, setStatus, setLoadingAll, setLoadingPack, game }: LocalController) {
  return (socket: GameClient) => {

    socket.on('updateTitle',  (title) => { 
      debugSockets && console.debug('SOCKET','updateTitle',title)
      title && updateGame((game) => game && ({ ...game, name: title }))
    })
    socket.on('updateName',  (playerId, name) => { 
      debugSockets && console.debug('SOCKET','updateName',playerId,name)
      name && renamePlayer(playerId, name)
    })
    socket.on('updatePick',  (playerId, pick, passingToId) => {
      debugSockets && console.debug('SOCKET','updatePick',playerId,pick,passingToId)
      pickCard(playerId, pick, passingToId)
    })
    socket.on('updateRound', (round) => {
      setLoadingAll((v) => v + 1)
      debugSockets && console.debug('SOCKET','updateRound',round)
      nextRound(round)
      reloadData({ game, updateLocal }).finally(() => setLoadingAll((v) => v && v - 1))
    })
    socket.on('updateSlot', (playerId, sessionId) => {
      debugSockets && console.debug('SOCKET','updateSlot',playerId,sessionId)
      setStatus(playerId, sessionId)
    })

    reloadData({ game, updateLocal }).finally(() => { setLoadingAll(0); setLoadingPack(0) })

    return () => {
      socket.removeAllListeners('updateName')
      socket.removeAllListeners('updatePick')
      socket.removeAllListeners('updateRound')
    }
  }
}


export function useGameEmitters(local: LocalController, { socket }: { socket: GameClient | null }) {
  
  const renamePlayer: Socket.RenamePlayer = useCallback((name, playerId) => {
    if (!socket?.connected) return console.error('Error renaming player: Not connected to server')
    if (!local.player) return console.error('Error renaming player: Player not loaded')

    name && local.renamePlayer(playerId || local.player.id, name)
    socket.emit('setName', playerId || local.player.id, name)
  }, [socket?.connected, local.player?.id, local.renamePlayer])

  const setTitle: Socket.SetTitle = useCallback((title) => {
    if (!socket?.connected) return console.error('Error renaming game: Not connected to server')
    if (!local.game) return console.error('Error renaming game: Game not loaded')

    title && local.updateGame((game) => game && ({ ...game, name: title }))
    socket.emit('setTitle', local.game.id, title)
  }, [socket?.connected, local.game?.id, local.updateGame])

  const nextRound: Socket.NextRound = useCallback(() => {
    if (!socket?.connected) return console.error('Error fetching next round: Not connected to server')
    if (!local.game || !('round' in local.game)) return console.error('Error fetching next round: Game not loaded')

    local.setLoadingPack((v) => v + 1)
    socket.emit('nextRound', local.game.id, local.game.round + 1)
  }, [socket?.connected, (local.game as Game)?.round])

  const pickCard: Socket.PickCard = useCallback((gameCardId) => {
    if (!socket?.connected || !local.player) return console.error('Error picking card: Not connected to server')
    
    local.setLoadingPack((v) => v + 1)
    socket.emit('pickCard', local.player.id, gameCardId, (pick) => {
      if (typeof pick !== 'number') console.error('Error picking: Failed to pick card')
      return reloadData(local).finally(() => local.setLoadingPack((v) => v && v - 1))
    })
  }, [socket?.connected, local.game?.id])

  const swapCard: Socket.SwapCard = useCallback((cardId, board) => {
    if (!socket?.connected) return console.error('Error moving card: Not connected to server')

    local.swapCard(cardId, board)
    socket.emit('swapBoards', cardId, board, (cardId, board) => {
      if (!cardId) return reloadData(local)
      local.swapCard(cardId, board)
    })
  }, [socket?.connected, local.swapCard])

  const setLands: Socket.SetLands = useCallback((lands) => {
    if (!socket?.connected || !local.player) return console.error('Error saving lands: Not connected to server')

    local.setLands(lands)
    socket.emit('setLands', local.player.id, lands, (lands) => {
      if (!lands) return reloadData(local)
      local.setLands(lands)
    })
  }, [socket?.connected, local.player?.id, local.setLands])

  const setStatus: Socket.SetStatus = useCallback((playerId, status = 'join') => {
    if (!socket?.connected) return console.error('Error updating player: Not connected to server')

    local.setLoadingAll((v) => v + 1)
    socket.emit('setStatus', playerId, status, (player) => {
      reloadData(local).finally(() => local.setLoadingAll((v) => v && v - 1))
      if (player?.id && player.sessionId && local.sessionId === player.sessionId && 'cards' in player) local.updatePlayer(player)
      if (player) local.setStatus(player.id, player.sessionId || null)
    })
  }, [socket?.connected, local.game?.id, local.sessionId, local.setStatus])

  return { renamePlayer, setTitle, nextRound, pickCard, swapCard, setLands, setStatus }
}


export type SocketController = ReturnType<typeof useGameEmitters>
