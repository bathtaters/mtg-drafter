import type { NextApiResponse } from 'next'
import type { Socket } from 'net'
import { Server, ServerOptions } from 'socket.io'

export function initSocketServer<S extends Server = Server, T = any>(path: string, res: SocketResponse, initServer: (io: S) => T) {
  if (res.socket.server.io && res.socket.server.io.path() === path)
    return console.log('Socket already open at',path)

  const io = new Server(res.socket.server, { path })
  res.socket.server.io = io

  console.log('New socket opened at',path)
  return initServer(res.socket.server.io as S)
}

export interface SocketResponse extends NextApiResponse {
  socket: Socket & { server: ServerOptions & { io?: Server } }
}