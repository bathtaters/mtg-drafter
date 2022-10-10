import type { NextApiRequest, NextApiResponse } from 'next'
import type { GameServer, GameMiddleware } from './game.socket.d'
import { getReqSessionId } from '../../components/base/services/sessionId.services'
import { getGameAndPlayer, getPack, nextRound, pickCard } from '../services/game/game.services'
import { renamePlayer, setStatus, swapCard, updateLands } from '../services/game/player.services'
import { debugSockets, MAX_GAME_CONN } from 'assets/constants'

export default async function gameSockets(io: GameServer, req: NextApiRequest, res: NextApiResponse) {

  const userData = await getGameAndPlayer(req.query.url, getReqSessionId(req, res))
  if (!userData) return 400

  io.setMaxListeners(MAX_GAME_CONN)

  io.on("connect", (socket) => {
    if (!userData) return socket.disconnect(true)

    socket.data = userData

    socket.use(async (ev, next) => {
      debugSockets && console.debug('RX Socket Event:', ...ev)
      await gameSocketMiddleware(socket, next)
    })

    socket.on('nextRound', async (round) => {
      const newRound = await nextRound(socket.data.gameId as string, round)
      io.emit('updateRound', newRound)
    })
    
    socket.on('setName', async (name) => {
      if (!name) return;
      await renamePlayer(socket.data.playerId as string, name)
      io.emit('updateName', socket.data.playerId as string, name)
    })
    
    socket.on('pickCard', async (gameCardId, callback) => {
      const pick = await pickCard(socket.data.playerId as string, gameCardId)
      if (pick == null) return callback()
      io.emit('updatePick', socket.data.playerId as string, pick)
      callback(pick)
    })

    socket.on('setStatus', async (playerId, status, callback) => {
      const player = await setStatus(playerId, status === 'join' ? socket.data.sessionId : null)
      if (!player?.id) return callback()

      if (player?.sessionId && player?.id) socket.data.playerId = player.id
      io.emit('updateSlot', player?.id || playerId, player?.sessionId || null)
      callback(player)
    })

    socket.on('getPack', async (packId, callback) => {
      const gameCardIds = await getPack(packId)
      callback(gameCardIds)
    })

    socket.on('swapBoards', async (gameCardId, toBoard, callback) => {
      const { id, board } = await swapCard(gameCardId, toBoard)
      callback(id, board)
    })

    socket.on('setLands', async (lands, callback) => {
      const newLands = await updateLands(socket.data.playerId as string, lands)
      callback(newLands)
    })

    debugSockets && console.debug('Connected', socket.data)
  })
}

const gameSocketMiddleware: GameMiddleware = async (socket, next) => {

  if (!socket.data?.gameId) {
    console.error('Connection is missing data', socket.data)
    return socket.disconnect(true)
  }

  return next()
}