/* eslint-disable react-hooks/exhaustive-deps */
import type { Game } from '@prisma/client'
import type { GameClient } from 'backend/controllers/game.socket.d'
import type { AlertsReturn } from 'components/base/common/Alerts/alerts.hook'
import type { ErrorAlert } from 'components/base/common/Alerts/alerts.d'
import type { LocalController } from './local.controller'
import type { BasicLands, Player, Socket } from 'types/game'
import type useSocket from 'components/base/libs/sockets'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { clientErrorsInConsole, debugSockets } from 'assets/constants'
import { reloadData } from '../game.controller'

const formatError = (message: string): ErrorAlert => ({ message: `${message}. Attempting to reconnect.`, title: 'Action Failed', theme: 'warning'  })

export function getGameListeners(
  { updateLocal, updateGame, renamePlayer, nextRound, pickCard, setStatus, setLoadingAll, setLoadingPack, game }: LocalController,
  throwError: AlertsReturn['newError'],
  onConnect?: () => void,
  refreshLog?: () => void,
  checkHostModal?: Dispatch<SetStateAction<boolean>>,
) {
  const updateLog = refreshLog && checkHostModal ? () => checkHostModal((isOpen) => {
    if (isOpen) refreshLog()
    return isOpen
  }) : undefined

  return (socket: GameClient) => {
    if (!socket) return;

    socket.on('updateTitle',  (title) => { 
      debugSockets && console.debug('SOCKET','updateTitle',title)
      title && updateGame((game) => game && ({ ...game, name: title }))
      updateLog && updateLog()
    })
    socket.on('updateName',  (playerId, name) => { 
      debugSockets && console.debug('SOCKET','updateName',playerId,name)
      name && renamePlayer(playerId, name)
      updateLog && updateLog()
    })
    socket.on('updatePick',  (playerId, pick, passingToId) => {
      debugSockets && console.debug('SOCKET','updatePick',playerId,pick,passingToId)
      pickCard(playerId, pick, passingToId)
      updateLog && updateLog()
    })
    socket.on('updateRound', (round) => {
      setLoadingAll((v) => v + 1)
      debugSockets && console.debug('SOCKET','updateRound',round)
      nextRound(round)
      reloadData(game?.url, updateLocal, throwError).finally(() => {
        setLoadingAll((v) => v && v - 1)
        updateLog && updateLog()
      })
    })
    socket.on('updateSlot', (playerId, sessionId) => {
      debugSockets && console.debug('SOCKET','updateSlot',playerId,sessionId)
      setStatus(playerId, sessionId)
      updateLog && updateLog()
    })
    
    clientErrorsInConsole && socket.on('error', (msg) => { console.error('Server Error:',msg) })

    onConnect && socket.on('connect', onConnect)

    reloadData(game?.url, updateLocal, throwError).finally(() => { setLoadingAll(0); setLoadingPack(0) })

    return () => {
      if (!socket) return;

      onConnect && socket.off('connect', onConnect)
      socket.removeAllListeners('updateTitle')
      socket.removeAllListeners('updateName')
      socket.removeAllListeners('updatePick')
      socket.removeAllListeners('updateRound')
      socket.removeAllListeners('updateSlot')
    }
  }
}


export function useGameEmitters(local: LocalController, { emit, reconnect }: ReturnType<typeof useSocket<GameClient>>, throwError: AlertsReturn['newError']) {
  
  const renamePlayer: Socket.RenamePlayer = useCallback((name, playerId, byHost = false) => {
    if (!local.player?.id) return throwError(formatError('Error renaming player: Player not loaded'))

    name && local.renamePlayer(playerId || local.player.id, name)
    
    emit('setName', playerId || local.player.id, name, byHost)
  }, [emit, local.player?.id, local.renamePlayer, throwError])


  const setTitle: Socket.SetTitle = useCallback((title) => {
    if (!local.game?.id) return throwError(formatError('Error renaming game: Game not loaded'))

    title && local.updateGame((game) => game && ({ ...game, name: title }))

    emit('setTitle', local.game.id, title)
  }, [emit, local.game?.id, local.updateGame, local.updateLocal, throwError])


  const nextRound: Socket.NextRound = useCallback(() => {
    if (!local.game?.id || !('round' in local.game)) return throwError(formatError('Error fetching next round: Game not loaded'))

    local.setLoadingPack((v) => v + 1)

    emit('nextRound', local.game.id, local.game.round + 1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emit, local.game?.id, (local.game as Game)?.round, local.setLoadingPack, throwError])


  const pickCard: Socket.PickCard = useCallback((gameCardOrPack) => {
    if (!local.player?.id) return throwError(formatError('Error picking card: Not connected to server'))
    
    local.setLoadingPack((v) => v + 1)

    emit('pickCard', local.player.id, gameCardOrPack, (pick?: number) => {
      if (typeof pick !== 'number') throwError(formatError('Error picking: Failed to pick card'))
      return reloadData(local.game?.url, local.updateLocal, throwError, typeof pick !== 'number' ? reconnect : undefined)
        .finally(() => local.setLoadingPack((v) => v && v - 1))
    })
  }, [emit, local.player?.id, local.game?.url, local.setLoadingPack, local.updateLocal, throwError, reconnect])


  const swapCard: Socket.SwapCard = useCallback((cardId, board) => {
    local.swapCard(cardId, board)

    emit('swapBoards', cardId, board, (cardId, board) => {
      if (!cardId) return reloadData(local.game?.url, local.updateLocal, throwError, reconnect)
      local.swapCard(cardId, board)
    })
  }, [emit, local.game?.url, local.swapCard, local.updateLocal, throwError, reconnect])


  const setLands: Socket.SetLands = useCallback((lands) => {
    if (!local.player?.id) return throwError(formatError('Error saving lands: Not connected to server'))

    local.setLands(lands)
    emit('setLands', local.player.id, lands, (lands: void | BasicLands) => {
      if (!lands) return reloadData(local.game?.url, local.updateLocal, throwError, reconnect)
      local.setLands(lands)
    })
  }, [emit, local.player?.id, local.game?.url, local.setLands, local.updateLocal, throwError, reconnect])


  const setStatus: Socket.SetStatus = useCallback((playerId, status = 'join', byHost = false) => {
    local.setLoadingAll((v) => v + 1)

    emit('setStatus', playerId, status, byHost, (player?: Player) => {
      reloadData(local.game?.url, local.updateLocal, throwError).finally(() => local.setLoadingAll((v) => v && v - 1))
      if (!player) return

      if (local.sessionId === player.sessionId)
        local.updatePlayer((p) => ({ ...(p || { cards: [] }), ...player }))
      local.setStatus(player.id, player.sessionId || null)
    })
  }, [emit, local.game?.url, local.sessionId, local.setLoadingAll, local.setStatus, local.updatePlayer, local.updateLocal, throwError])


  return { renamePlayer, setTitle, nextRound, pickCard, swapCard, setLands, setStatus }
}


export type SocketController = ReturnType<typeof useGameEmitters>
