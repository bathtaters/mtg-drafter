import type { NextApiRequest } from 'next'
import type { GameServer } from 'backend/controllers/game.socket.d'
import { initSocketServer, SocketResponse } from 'backend/libs/sockets'
import gameSockets from 'backend/controllers/game.socket'
import { INVALID_PATH } from 'assets/urls'

export default async function handler(req: NextApiRequest, res: SocketResponse) {
  if (typeof req.query.url !== 'string' || req.query.url === INVALID_PATH) return res.status(404).end()

  const code = await initSocketServer<GameServer, Promise<number | undefined>>(`/game/${req.query.url}`, res, (io) => gameSockets(io, req, res))
  if (code) return res.status(code).end()

  return res.end()
}
