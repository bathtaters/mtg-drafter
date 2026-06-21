import type { NextApiRequest } from "next";
import type { GameServer } from "backend/controllers/game.socket.d";
import { initSocketServer, SocketResponse } from "backend/libs/sockets";
import gameSockets from "backend/controllers/game.socket";
import { getReqSessionId } from "backend/libs/auth";
import { gameExists } from "backend/services/game/game.services";
import { INVALID_PATH } from "assets/urls";
import { withMetrics } from "backend/libs/metrics";

async function handler(req: NextApiRequest, res: SocketResponse) {
  if (typeof req.query.url !== "string" || req.query.url === INVALID_PATH) {
    res.status(404).end();
    return;
  }

  const exists = await gameExists(req.query.url);
  if (!exists) {
    res.status(400).end();
    return;
  }

  getReqSessionId(req, res); // ensure session is created before the WS handshake
  initSocketServer<GameServer>(res, gameSockets);
  res.end();
}

export default withMetrics("/api/game/[url]/socket", handler as any);
