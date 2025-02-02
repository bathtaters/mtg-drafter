import type { GameServer, GameSocket } from 'backend/controllers/game.socket.d'
import type { BasicLands } from 'types/game'
import { getExisitingSessionId } from 'backend/libs/auth'
import { banPlayer, getPlayerGame, renamePlayer, setStatus, swapCard, updateLands } from './player.services'
import { checkBanOrLock } from './game.services'
import { setWatcher } from './log.services'
import { handleBotPicks } from './game.sockets'
import { gameIsEnded } from 'components/game/shared/game.utils'
import validation from 'types/game.validation'
import { BOT } from 'assets/constants'
import { banMsg } from 'assets/strings'


export default function addPlayerListeners(io: GameServer, socket: GameSocket) {
    
    socket.on('setName', async (playerId, name, byHost) => {
      try {
        // Validation
        playerId = validation.id.parse(playerId)
        name = validation.name.parse(name)
        if (!name) throw new Error('No name provided')
        
        // Update DB
        const player = await renamePlayer(playerId, name, byHost)
        player != null && io.emit('updateName', player.id, player.name)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error changing name: ${err.message || 'Unknown'}`)
      }
    })
    

    socket.on('setStatus', async (playerId, status, byHost, callback) => {
      try {
        // Validation
        playerId = validation.id.parse(playerId)
        status = validation.status.parse(status)

        const game = await getPlayerGame(playerId)
        if (!game) throw new Error('Player not found')
        
        const sessionId = status === 'bot' ? BOT : status === 'join' && getExisitingSessionId(socket.request)
        if (sessionId == null) throw new Error('Missing user identity')

        const isBanned = sessionId && sessionId !== BOT &&  await checkBanOrLock(game.id, sessionId)
        if (isBanned) throw new Error(banMsg)

        // Update DB
        const player = await setStatus(playerId, sessionId || null, byHost)
        if (!player?.id) throw new Error('Player not found')

        // Force logout if Watching game
        if (sessionId && sessionId !== BOT && !gameIsEnded(game)) {
          const session = await setWatcher(game.id, sessionId, false)
          if (session) io.emit('updateWatcher', session, false)
        }

        // Update Client(s)
        io.emit('updateSlot', player?.id || playerId, player?.sessionId || null)
        callback(player)

        if (status === 'bot') await handleBotPicks(io, socket, player.gameId)

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


    socket.on('banSession', async (gameId, sessionId, unban, playerId) => {
      try {
        // Validation
        gameId = validation.id.parse(gameId)
        sessionId = validation.session.nullable().parse(sessionId)
        unban = validation.bool.parse(unban)
        playerId = validation.id.nullable().optional().parse(playerId)

        // Update DB
        const result = await banPlayer(gameId, sessionId, unban, playerId)
        if (result.unban !== unban) throw new Error('Update failed')

        // Update Client(s)
        io.emit('updateBan', result)
        
      } catch (err: any) {
        socket.emit('error', `Error updating ${sessionId ? 'user ban' : 'game lock'} status: ${err.message || 'Unknown'}`)
      }
    })
}
