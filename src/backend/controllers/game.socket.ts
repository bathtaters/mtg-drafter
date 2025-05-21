import type { NextApiRequest, NextApiResponse } from 'next'
import type { IncomingMessage } from 'http'
import type { GameServer } from './game.socket.d'
import { parseCookies } from 'nookies'
import { getReqSessionId } from '../libs/auth'
import { gameExists } from '../services/game/game.services'
import { debugSockets, MAX_GAME_CONN } from 'assets/constants'
import addGameListeners from 'backend/services/game/game.sockets'
import addPlayerListeners from 'backend/services/game/player.sockets'

const getSessionId = (req: IncomingMessage) => parseCookies({ req }).sessionId

export default async function gameSockets(io: GameServer, req: NextApiRequest, res: NextApiResponse) {
  const initialSessionId = getReqSessionId(req,res)

  const exists = await gameExists(req.query.url)
  if (!exists) return 400

  io.on("connect", (socket) => {
    if (!exists) return socket.disconnect(true)

    socket.setMaxListeners(MAX_GAME_CONN)
    const currentSessionId = getSessionId(socket.request) || initialSessionId

    addGameListeners(io, socket, currentSessionId)
    addPlayerListeners(io, socket, currentSessionId)

    if (debugSockets) {
      socket.use(async (ev, next) => {
        console.debug('RX Socket Event:', io.path(), currentSessionId, ...ev)
        next()
      })

      console.debug('New Connection', io.path(), initialSessionId)
    }
  })
}
