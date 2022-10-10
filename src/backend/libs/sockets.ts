import type { NextApiResponse } from 'next'
import type { Socket } from 'net'
import { Server, ServerOptions } from 'socket.io'
import { debugSockets } from 'assets/constants'

export function initSocketServer<S extends Server = Server, T = any>(path: string, res: SocketResponse, initServer: (io: S) => T) {
  if (res.socket.server.io && res.socket.server.io.path() === path)
    return debugSockets ? console.debug('Socket already open at',path) : undefined

  const io = new Server(res.socket.server, { path })
  res.socket.server.io = io

  debugSockets && io.on('connect', (socket) => {
    socket.on('disconnect', () => console.debug('Socket closed at',path,socket.id))
    console.debug('New socket opened at',path,socket.id)
  })
  
  return initServer(res.socket.server.io as S)
}

export interface SocketResponse extends NextApiResponse {
  socket: Socket & { server: ServerOptions & { io?: Server } }
}