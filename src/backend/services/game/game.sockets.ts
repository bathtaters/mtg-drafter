import type { GameServer, GameSocket } from 'backend/controllers/game.socket.d'
import { nextRound, pauseGame, resumeGame, pickCard, renameGame } from './game.services'
import validation from 'types/game.validation'


export default function addGameListeners(io: GameServer, socket: GameSocket) {

    socket.on('setTitle', async (gameId, title) => {
      try {
        // Validation
        gameId = validation.id.parse(gameId)
        title = validation.name.parse(title)
        if (!title) throw new Error('No title provided')
        
        // Update DB
        const newTitle = await renameGame(gameId, title)
        newTitle != null && io.emit('updateTitle', newTitle)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error changing title: ${err.message || 'Unknown'}`)
      }
    })


    socket.on('nextRound', async (gameId, round) => {
      try {
        // Validation
        gameId = validation.id.parse(gameId)
        round = validation.round.parse(round)

        // Update DB
        const newRound = await nextRound(gameId, round)
        newRound != null && io.emit('updateRound', newRound)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error changing rounds: ${err.message || 'Unknown'}`)
      }
    })


    socket.on('pauseTimer', async (gameId, pause) => {
      try {
        // Validation
        gameId = validation.id.parse(gameId)
        pause = validation.bool.parse(pause)

        // Update DB
        const pauseTimer = await (pause ? pauseGame(gameId) : resumeGame(gameId))
        io.emit('updateTimer', pauseTimer)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error pausing game: ${err.message || 'Unknown'}`)
      }
    })
    

    socket.on('pickCard', async (playerId, gameCardOrPack, callback) => {
      try {
        // Validation
        playerId = validation.id.parse(playerId)
        gameCardOrPack = validation.idOrNum.parse(gameCardOrPack)

        // Update DB
        const player = await pickCard(playerId, gameCardOrPack)
        if (typeof player === 'string') throw new Error(player === 'Player' ? 'Player not found' : 'Card was already picked or does not exist')

        // Update Client(s)
        io.emit('updatePick', player.id, player.pick, player.passingToId)
        callback(player.pick)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error picking card: ${err.message || 'Unknown'}`)
        callback(undefined)
      }
    })
}
