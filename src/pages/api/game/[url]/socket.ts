import type { NextApiRequest } from "next";
import type { GameServer } from "backend/controllers/game.socket.d";
import { initSocketServer, SocketResponse } from "backend/libs/sockets";
import gameSockets from "backend/controllers/game.socket";
import { INVALID_PATH } from "assets/urls";
import { withMetrics } from "backend/libs/metrics";

async function handler(req: NextApiRequest, res: SocketResponse) {
  if (typeof req.query.url !== "string" || req.query.url === INVALID_PATH) {
    res.status(404).end();
    return;
  }

  const code = await initSocketServer<GameServer, Promise<number | undefined>>(
    `/game/${req.query.url}`,
    res,
    (io) => gameSockets(io, req, res)
  );
  code ? res.status(code).end() : res.end();
}

export default withMetrics("/api/game/[url]/socket", handler as any);
