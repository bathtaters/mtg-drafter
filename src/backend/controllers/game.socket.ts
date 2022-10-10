import type { NextApiRequest, NextApiResponse } from 'next'
import type { GameServer } from './game.socket.d'
import { parseCookies } from 'nookies'
import { getReqSessionId } from 'components/base/services/sessionId.services'
import { gameExists, getPack, nextRound, pickCard } from '../services/game/game.services'
import { renamePlayer, setStatus, swapCard, updateLands } from '../services/game/player.services'
import { debugSockets, MAX_GAME_CONN } from 'assets/constants'
import { IncomingMessage } from 'http'

const getSessionId = (req: IncomingMessage) => parseCookies({ req }).sessionId

export default async function gameSockets(io: GameServer, req: NextApiRequest, res: NextApiResponse) {
  const sessionId = getReqSessionId(req,res)

  const exists = await gameExists(req.query.url)
  if (!exists) return 400

  io.setMaxListeners(MAX_GAME_CONN)
  
  io.on("connect", (socket) => {
    if (!exists) return socket.disconnect(true)

    debugSockets && socket.use(async (ev, next) => {
      console.debug('RX Socket Event:', io.path(), getSessionId(socket.request), ...ev)
      next()
    })

    socket.on('nextRound', async (gameId, round) => {
      const newRound = await nextRound(gameId, round)
        .catch((err) => console.error('Error nextRound',gameId,round, err))
      newRound != null && io.emit('updateRound', newRound)
    })
    
    socket.on('setName', async (playerId, name) => {
      if (!name) return;
      const player = await renamePlayer(playerId, name)
        .catch((err) => console.error('Error renamePlayer',playerId,name, err))
      player != null && io.emit('updateName', player.id, player.name)
    })
    
    socket.on('pickCard', async (playerId, gameCardId, callback) => {
      const player = await pickCard(playerId, gameCardId)
        .catch((err) => console.error('Error pickCard',playerId,gameCardId, err))
      if (player == null) return callback(undefined)

      io.emit('updatePick', player.id, player.pick)
      callback(player.pick)
    })
    
    socket.on('setStatus', async (playerId, status, callback) => {
      const sessionId = status === 'join' && getSessionId(socket.request)
      if (sessionId == null) {
        console.error('Attempting to connect player w/o sessionId')
        return callback(undefined)
      }

      const player = await setStatus(playerId, sessionId || null)
        .catch((err) => console.error('Error setStatus',status,playerId, err))
      if (!player?.id) return callback(undefined)

      io.emit('updateSlot', player?.id || playerId, player?.sessionId || null)
      callback(player)
    })

    socket.on('getPack', async (packId, callback) => {
      const gameCardIds = await getPack(packId)
        .catch((err) => console.error('Error getPack',packId, err))
      callback(gameCardIds)
    })

    socket.on('swapBoards', async (gameCardId, toBoard, callback) => {
      const card = await swapCard(gameCardId, toBoard)
        .catch((err) => console.error('Error swapBoards',gameCardId,toBoard, err))
      callback(card?.id, card?.board)
    })

    socket.on('setLands', async (playerId, lands, callback) => {
      const newLands = await updateLands(playerId, lands)
        .catch((err) => console.error('Error setLands',playerId,lands, err))
      callback(newLands)
    })

    debugSockets && console.debug('New Connection', io.path(), sessionId)
  })
}
