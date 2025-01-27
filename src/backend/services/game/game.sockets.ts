import type { Game } from '@prisma/client'
import type { GameServer, GameSocket } from 'backend/controllers/game.socket.d'
import { nextRound, pauseGame, resumeGame, pickCard, updateGame } from './game.services'
import { getBotPicks } from './bot.services'
import { setPassword } from './log.services'
import validation, { logAuth, gameOptions } from 'types/game.validation'


export default function addGameListeners(io: GameServer, socket: GameSocket) {

    socket.on('setOptions', async (gameId, options) => {
      try {
        // Validation
        gameId = validation.id.parse(gameId)
        options = gameOptions.parse(options)
        if (!options) throw new Error('No title provided')
        
        // Update DB
        const result = await updateGame(gameId, options)
        result != null && Object.keys(result).length && io.emit('updateGame', result)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error updating game: ${err.message || 'Unknown'}`)
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

        await handleBotPicks(io, socket, player.gameId)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error picking card: ${err.message || 'Unknown'}`)
        callback(undefined)
      }
    })
    

    socket.on('setWatchPw', async (gameId, password) => {
      try {
        // Validation
        gameId = validation.id.parse(gameId)
        password = logAuth.password.parse(password) ?? null
        
        // Update DB
        const exists = await setPassword(gameId, password)
        if (exists === null) throw new Error('Failed to save password')

        io.emit('updateWatchPw', exists ? 'Enabled' : null)

      // Handle Error
      } catch (err: any) {
        socket.emit('error', `Error updating watch password: ${err.message || 'Unknown'}`)
      }
    })
}


export async function handleBotPicks(io: GameServer, socket: GameSocket, gameId: Game['id']) {
  // Check for and execute bot picks
  try {
    const picks = await getBotPicks(gameId)
    for (const pick of picks) {
      const bot = await pickCard(...pick)
      if (typeof bot === 'string') throw new Error(bot === 'Player' ? 'Bot not found' : 'Card was already picked or does not exist')
      
      io.emit('updatePick', bot.id, bot.pick, bot.passingToId)
    }
  } catch (err: any) {
    socket.emit('error', `Error picking bot cards: ${err.message || 'Unknown'}`)
  }
}