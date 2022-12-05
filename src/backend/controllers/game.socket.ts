import type { NextApiRequest, NextApiResponse } from 'next'
import type { IncomingMessage } from 'http'
import type { GameServer } from './game.socket.d'
import type { BasicLands } from 'types/game'
import { parseCookies } from 'nookies'
import { getReqSessionId } from 'components/base/services/sessionId.services'
import { gameExists, nextRound, pickCard, renameGame } from '../services/game/game.services'
import { renamePlayer, setStatus, swapCard, updateLands } from '../services/game/player.services'
import validation from 'types/game.validation'
import { debugSockets, MAX_GAME_CONN } from 'assets/constants'

const getSessionId = (req: IncomingMessage) => parseCookies({ req }).sessionId

export default async function gameSockets(io: GameServer, req: NextApiRequest, res: NextApiResponse) {
  const sessionId = getReqSessionId(req,res)

  const exists = await gameExists(req.query.url)
  if (!exists) return 400

  io.on("connect", (socket) => {
    if (!exists) return socket.disconnect(true)

    debugSockets && socket.use(async (ev, next) => {
      console.debug('RX Socket Event:', io.path(), getSessionId(socket.request), ...ev)
      next()
    })

    socket.setMaxListeners(MAX_GAME_CONN)

    socket.on('setTitle', async (gameId, title) => {
      try {
        gameId = validation.id.parse(gameId)
        title = validation.name.parse(title)
        if (!title) throw new Error('No title provided')
  
        const newTitle = await renameGame(gameId, title)
        newTitle != null && io.emit('updateTitle', newTitle)

      } catch (err: any) {
        socket.emit('error', `Error changing title: ${err.message || 'Unknown'}`)
      }
    })

    socket.on('nextRound', async (gameId, round) => {
      try {
        gameId = validation.id.parse(gameId)
        round = validation.round.parse(round)

        const newRound = await nextRound(gameId, round)
        newRound != null && io.emit('updateRound', newRound)

      } catch (err: any) {
        socket.emit('error', `Error changing rounds: ${err.message || 'Unknown'}`)
      }
    })
    
    socket.on('setName', async (playerId, name) => {
      try {
        playerId = validation.id.parse(playerId)
        name = validation.name.parse(name)
        if (!name) throw new Error('No name provided')
        
        const player = await renamePlayer(playerId, name)
        player != null && io.emit('updateName', player.id, player.name)

      } catch (err: any) {
        socket.emit('error', `Error changing name: ${err.message || 'Unknown'}`)
      }
    })
    
    socket.on('pickCard', async (playerId, gameCardId, callback) => {
      try {
        playerId = validation.id.parse(playerId)
        gameCardId = validation.id.parse(gameCardId)

        const player = await pickCard(playerId, gameCardId)
        if (player == null) throw new Error('Player not found')

        io.emit('updatePick', player.id, player.pick, player.passingToId)
        callback(player.pick)

      } catch (err: any) {
        socket.emit('error', `Error picking card: ${err.message || 'Unknown'}`)
        callback(undefined)
      }
    })
    
    socket.on('setStatus', async (playerId, status, callback) => {
      try {
        playerId = validation.id.parse(playerId)
        status = validation.status.parse(status)
        
        const sessionId = status === 'join' && getSessionId(socket.request)
        if (sessionId == null) throw new Error('Missing user identity')

        const player = await setStatus(playerId, sessionId || null)
        if (!player?.id) throw new Error('Player not found')

        io.emit('updateSlot', player?.id || playerId, player?.sessionId || null)
        callback(player)

      } catch (err: any) {
        socket.emit('error', `Unable to ${status || 'set status'}: ${err.message || 'Unknown'}`)
        callback(undefined)
      }
    })

    socket.on('swapBoards', async (gameCardId, toBoard, callback) => {
      try {
        gameCardId = validation.id.parse(gameCardId)
        toBoard = validation.board.parse(toBoard)
        
        const card = await swapCard(gameCardId, toBoard)
        callback(card?.id, card?.board)

      } catch (err: any) {
        socket.emit('error', `Error updating card position: ${err.message || 'Unknown'}`)
      }
    })

    socket.on('setLands', async (playerId, lands, callback) => {
      try {
        playerId = validation.id.parse(playerId)
        lands = validation.basics.parse(lands) as BasicLands
        
        const newLands = await updateLands(playerId, lands)
        callback(newLands)
        
      } catch (err: any) {
        socket.emit('error', `Error setting basic lands: ${err.message || 'Unknown'}`)
      }
    })

    debugSockets && console.debug('New Connection', io.path(), sessionId)
  })
}
