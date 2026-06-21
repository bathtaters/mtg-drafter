import type { GameServer } from "./game.socket.d";
import { getExisitingSessionId } from "../libs/auth";
import { metrics } from "../libs/metrics";
import { gameExists } from "../services/game/game.services";
import { debugSockets, MAX_GAME_CONN } from "assets/constants";
import addGameListeners from "backend/services/game/game.sockets";
import addPlayerListeners from "backend/services/game/player.sockets";

const GAME_NSP = /^\/game\/[^/]+$/;

export default function gameSockets(io: GameServer) {
  io.of(GAME_NSP).on("connection", async (socket) => {
    const nsp = socket.nsp; // /game/<id>
    const url = nsp.name.slice("/game/".length);

    const exists = await gameExists(url);
    if (!exists) return socket.disconnect(true);

    metrics.socketTotal.inc({ namespace: nsp.name });
    metrics.socketActive.inc({ namespace: nsp.name });
    socket.on("disconnect", () => {
      metrics.socketActive.dec({ namespace: nsp.name });
      if (debugSockets) console.debug("Socket closed at", nsp.name, socket.id);
    });

    socket.setMaxListeners(MAX_GAME_CONN);
    const currentSessionId = getExisitingSessionId(socket.request) ?? null;

    addGameListeners(nsp, socket, currentSessionId);
    addPlayerListeners(nsp, socket, currentSessionId);

    if (debugSockets) {
      socket.use(async (ev, next) => {
        console.debug("RX Socket Event:", nsp.name, currentSessionId, ...ev);
        next();
      });

      console.debug("New Connection", nsp.name, currentSessionId);
    }
  });
}
