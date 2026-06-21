import type { NextApiResponse } from "next";
import type { Socket } from "net";
import { Server, ServerOptions } from "socket.io";
import { SOCKET_PATH } from "assets/constants";

export function initSocketServer<S extends Server = Server>(
  res: SocketResponse,
  initServer: (io: S) => void
): S {
  if (res.socket.server.io) return res.socket.server.io as S; // already initialised

  const io = new Server(res.socket.server, {
    path: SOCKET_PATH,
    cleanupEmptyChildNamespaces: true, // drop abandoned per-game namespaces
  });
  res.socket.server.io = io;

  initServer(io as S); // register dynamic namespace ONCE

  return io as S;
}

export interface SocketResponse extends NextApiResponse {
  socket: Socket & { server: ServerOptions & { io?: Server } };
}
