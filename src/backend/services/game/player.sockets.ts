import type { GameServer, GameSocket } from 'backend/controllers/game.socket.d'
import type { BasicLands } from 'types/game'
import { getExisitingSessionId } from 'components/base/libs/auth'
import { renamePlayer, setStatus, swapCard, updateLands } from './player.services'
import validation from 'types/game.validation'


export default function addPlayerListeners(io: GameServer, socket: GameSocket) {
    
    socket.on('setName', async (playerId, name) => {
      try {
        // Validation
        playerId = validation.id.parse(playerId)
        name = validation.name.parse(name)
        if (!name) throw new Error('No name provided')
        
        // Update DB
        const player = await renamePlayer(playerId, name)
        player != null && io.emit('updateName', player.id, player.name)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error changing name: ${err.message || 'Unknown'}`)
      }
    })
    

    socket.on('setStatus', async (playerId, status, callback) => {
      try {
        // Validation
        playerId = validation.id.parse(playerId)
        status = validation.status.parse(status)
        
        const sessionId = status === 'join' && getExisitingSessionId(socket.request)
        if (sessionId == null) throw new Error('Missing user identity')

        // Update DB
        const player = await setStatus(playerId, sessionId || null)
        if (!player?.id) throw new Error('Player not found')

        // Update Client(s)
        io.emit('updateSlot', player?.id || playerId, player?.sessionId || null)
        callback(player)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Unable to ${status || 'set status'}: ${err.message || 'Unknown'}`)
        callback(undefined)
      }
    })


    socket.on('swapBoards', async (gameCardId, toBoard, callback) => {
      try {
        // Validation
        gameCardId = validation.id.parse(gameCardId)
        toBoard = validation.board.parse(toBoard)
        
        // Update DB
        const card = await swapCard(gameCardId, toBoard)
        callback(card?.id, card?.board)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error updating card position: ${err.message || 'Unknown'}`)
      }
    })


    socket.on('setLands', async (playerId, lands, callback) => {
      try {
        // Validation
        playerId = validation.id.parse(playerId)
        lands = validation.basics.parse(lands) as BasicLands
        
        // Update DB
        const newLands = await updateLands(playerId, lands)
        callback(newLands)
        
      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error setting basic lands: ${err.message || 'Unknown'}`)
      }
    })
}
