import type { Game, Player } from "@prisma/client";
import type { GameServer, GameSocket } from "backend/controllers/game.socket.d";
import { isDbErr } from "backend/libs/db";
import { metrics } from "backend/libs/metrics";
import {
  nextRound,
  pauseGame,
  resumeGame,
  pickCard,
  updateGame,
  checkBan,
} from "./game.services";
import { getBotPicks } from "./bot.services";
import {
  setWatcher,
  setPassword,
  testPassword,
  userInGame,
  userIsWatcher,
  canView,
} from "./log.services";
import validation, { authPassword, gameOptions } from "types/game.validation";
import { gameIsEnded } from "components/game/shared/game.utils";
import { banMsg, noPwMsg, viewAuthError } from "assets/strings";

export default function addGameListeners(
  io: GameServer,
  socket: GameSocket,
  currentSessionId: Player["sessionId"]
) {
  socket.on("setOptions", async (gameId, options) => {
    try {
      // Validation
      gameId = validation.id.parse(gameId);
      options = gameOptions.parse(options);
      if (!options) throw new Error("No title provided");

      // Update DB
      const result = await updateGame(gameId, options, currentSessionId);
      result != null &&
        Object.keys(result).length &&
        io.emit("updateGame", result);

      // Handle Error
    } catch (err: any) {
      socket.emit(
        "errorMsg",
        `Error updating game: ${err.message || "Unknown"}`
      );
    }
  });

  socket.on("nextRound", async (gameId, round) => {
    try {
      // Validation
      gameId = validation.id.parse(gameId);
      round = validation.round.parse(round);

      // Update DB
      const newRound = await nextRound(gameId, round, currentSessionId);
      newRound != null && io.emit("updateRound", newRound);

      // Handle Error
    } catch (err: any) {
      socket.emit(
        "errorMsg",
        `Error changing rounds: ${err.message || "Unknown"}`
      );
    }
  });

  socket.on("pauseTimer", async (gameId, pause) => {
    try {
      // Validation
      gameId = validation.id.parse(gameId);
      pause = validation.bool.parse(pause);

      // Update DB
      const pauseTimer = await (pause
        ? pauseGame(gameId, currentSessionId)
        : resumeGame(gameId, currentSessionId));
      io.emit("updateTimer", pauseTimer);

      // Handle Error
    } catch (err: any) {
      socket.emit(
        "errorMsg",
        `Error pausing game: ${err.message || "Unknown"}`
      );
    }
  });

  socket.on("pickCard", async (playerId, gameCardOrPack, callback) => {
    try {
      // Validation
      playerId = validation.id.parse(playerId);
      gameCardOrPack = validation.idOrNum.parse(gameCardOrPack);

      // Update DB
      const player = await pickCard(playerId, gameCardOrPack, currentSessionId);
      if (typeof player === "string")
        throw new Error(
          player === "Player"
            ? "Player not found"
            : "Card was already picked or does not exist"
        );

      // Update Client(s)
      metrics.picksMade.inc({ actor: "human" });
      io.emit("updatePick", player.id, player.pick, player.passingToId);
      callback(player.pick);

      await handleBotPicks(io, socket, player.gameId);

      // Handle Error
    } catch (err: any) {
      socket.emit(
        "errorMsg",
        `Error picking card: ${err.message || "Unknown"}`
      );
      callback(undefined);
    }
  });

  socket.on("setWatchPw", async (gameId, password) => {
    try {
      // Validation
      gameId = validation.id.parse(gameId);
      password = authPassword.parse(password) ?? null;

      // Update DB
      const exists = await setPassword(gameId, password, currentSessionId);
      if (exists === null) throw new Error("Failed to save password");

      io.emit("updateWatchPw", exists ? "Enabled" : null);

      // Handle Error
    } catch (err: any) {
      socket.emit(
        "errorMsg",
        `Error updating watch password: ${err.message || "Unknown"}`
      );
    }
  });

  socket.on("watcherLogin", async (gameId, sessionId, password, callback) => {
    try {
      // Validation
      gameId = validation.id.parse(gameId);
      sessionId = validation.session.parse(sessionId);
      password = authPassword.parse(password);

      // Login checks
      const isBanned = await checkBan(gameId, sessionId);
      if (isBanned) throw new Error(banMsg);

      const isLoggedIn = await userIsWatcher(gameId, sessionId);
      if (isLoggedIn) return callback(true, undefined); // Already logged in
      if (!password) throw new Error(noPwMsg);

      const message = await testPassword(gameId, password);
      if (message) throw new Error(message);

      const game = await userInGame(gameId, sessionId);
      if (game && !gameIsEnded(game))
        throw new Error("Players cannot view log until game has ended");

      // Update DB
      const result = await setWatcher(gameId, sessionId, true);
      if (result.sessionId !== sessionId) throw new Error("Server failure");

      callback(true, undefined);
      io.emit("updateWatcher", sessionId, true, result.name || undefined);

      // Handle Error
    } catch (err: any) {
      if (typeof err.message === "string" && err.message[0] === "[") {
        // Zod error
        const errorArray = JSON.parse(err.message);
        callback(
          false,
          (errorArray[0]?.message || "Password input error").replace(
            "String",
            "Password"
          )
        );
      } else if (isDbErr(err)) {
        // Prisma error
        console.error("DATABASE ERROR", err);
        callback(false, "Database error");
      } else {
        // Generic error
        callback(false, err.message || "Login failed");
      }
    }
  });

  socket.on("dropWatcher", async (gameId, sessionId, byHost) => {
    try {
      // Validation
      gameId = validation.id.parse(gameId);
      sessionId = validation.session.parse(sessionId);

      // Update DB
      const result = await setWatcher(
        gameId,
        sessionId,
        false,
        byHost ? currentSessionId : null
      );
      if (result.sessionId !== sessionId)
        throw new Error("Failed to drop watcher");

      io.emit("updateWatcher", sessionId, false, undefined);

      // Handle Error
    } catch (err: any) {
      socket.emit(
        "errorMsg",
        `Error dropping watcher: ${err.message || "Unknown"}`
      );
    }
  });

  socket.on(
    "viewCards",
    async (gameId, sessionId, playerId, cards, callback) => {
      const authErrorCode = await canView(
        gameId,
        sessionId,
        playerId,
        cards,
        false
      );
      if (authErrorCode)
        return callback(
          false,
          viewAuthError[authErrorCode] || viewAuthError.DEFAULT
        );
      callback(true);
      io.emit("viewedCards", sessionId);
    }
  );
}

export async function handleBotPicks(
  io: GameServer,
  socket: GameSocket,
  gameId: Game["id"]
) {
  // Check for and execute bot picks
  try {
    const picks = await getBotPicks(gameId);
    for (const pick of picks) {
      const bot = await pickCard(...pick);
      if (typeof bot === "string")
        throw new Error(
          bot === "Player"
            ? "Bot not found"
            : "Card was already picked or does not exist"
        );

      metrics.picksMade.inc({ actor: "bot" });
      io.emit("updatePick", bot.id, bot.pick, bot.passingToId);
    }
  } catch (err: any) {
    socket.emit(
      "errorMsg",
      `Error picking bot cards: ${err.message || "Unknown"}`
    );
  }
}
