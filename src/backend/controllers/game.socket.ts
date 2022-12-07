import type { NextApiRequest, NextApiResponse } from 'next'
import type { IncomingMessage } from 'http'
import type { GameServer } from './game.socket.d'
import { parseCookies } from 'nookies'
import { getReqSessionId } from 'components/base/libs/auth'
import { gameExists } from '../services/game/game.services'
import { debugSockets, MAX_GAME_CONN } from 'assets/constants'
import addGameListeners from 'backend/services/game/game.sockets'
import addPlayerListeners from 'backend/services/game/player.sockets'

const getSessionId = (req: IncomingMessage) => parseCookies({ req }).sessionId

export default async function gameSockets(io: GameServer, req: NextApiRequest, res: NextApiResponse) {
  const sessionId = getReqSessionId(req,res)

  const exists = await gameExists(req.query.url)
  if (!exists) return 400

  io.on("connect", (socket) => {
    if (!exists) return socket.disconnect(true)

    socket.setMaxListeners(MAX_GAME_CONN)

    addGameListeners(io, socket)
    addPlayerListeners(io, socket)

    if (debugSockets) {
      socket.use(async (ev, next) => {
        console.debug('RX Socket Event:', io.path(), getSessionId(socket.request), ...ev)
        next()
      })

      console.debug('New Connection', io.path(), sessionId)
    }
  })
}
