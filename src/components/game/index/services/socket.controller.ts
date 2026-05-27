/* eslint-disable react-hooks/exhaustive-deps */
import type {
  GameClient,
  GameServerToClient,
} from "backend/controllers/game.socket.d";
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook";
import type { ErrorAlert } from "components/base/common/Alerts/alerts.d";
import type { LocalController } from "./local.controller";
import type { Game, BasicLands, Player, Socket } from "types/game";
import { Dispatch, SetStateAction, useCallback } from "react";
import { hashText } from "components/base/libs/encrypt";
import { PlayerStatus } from "types/game";
import { reloadData, BasicController } from "../basic.controller";
import { clientErrorsInConsole, debugSockets } from "assets/constants";

const formatError = (message: string): ErrorAlert => ({
  message: `${message}. Attempting to reconnect.`,
  title: "Action Failed",
  theme: "warning",
});

export function getGameListeners(
  gameUrl: string | undefined,
  sessionId: string | undefined,
  {
    /* Only import 'useState' setters below,
      other data will be stale. */
    updateLocal,
    updateGame,
    renamePlayer,
    nextRound,
    pauseGame,
    setViewed,
    pickCard,
    setStatus,
    banSession,
    setLoadingAll,
    setLoadingPack,
  }: LocalController,
  newError: AlertsReturn["newError"],
  onConnect?: () => void,
  refreshLog?: () => void,
  checkHostModal?: Dispatch<SetStateAction<boolean>>,
) {
  return (socket: GameClient) => {
    if (!socket) return;

    const updateGameListener: GameServerToClient["updateGame"] = (options) => {
      debugSockets && console.debug("SOCKET", "updateGame", options);
      options && updateGame((game) => game && { ...game, ...options });
      if (!options.hostId || options.hostId === sessionId) refreshLog?.();
      else if (checkHostModal) checkHostModal(false); // Close host modal when losing Host status
    };
    const updateName: GameServerToClient["updateName"] = (playerId, name) => {
      debugSockets && console.debug("SOCKET", "updateName", playerId, name);
      name && renamePlayer(playerId, name);
      refreshLog?.();
    };
    const updatePick: GameServerToClient["updatePick"] = (
      playerId,
      pick,
      passingToId,
    ) => {
      debugSockets &&
        console.debug("SOCKET", "updatePick", playerId, pick, passingToId);
      pickCard(playerId, pick, passingToId);
      refreshLog?.();
    };
    const updateRound: GameServerToClient["updateRound"] = (round) => {
      setLoadingAll((v) => v + 1);
      debugSockets && console.debug("SOCKET", "updateRound", round);
      nextRound(round);
      reloadData(gameUrl, updateLocal, newError).finally(() => {
        setLoadingAll((v) => v && v - 1);
        refreshLog?.();
      });
    };
    const updateTimer: GameServerToClient["updateTimer"] = (pauseTime) => {
      setLoadingAll((v) => v + 1);
      debugSockets && console.debug("SOCKET", "updateTimer", pauseTime);
      pauseGame(pauseTime);
      reloadData(gameUrl, updateLocal, newError).finally(() => {
        setLoadingAll((v) => v && v - 1);
        refreshLog?.();
      });
    };
    const updateSlot: GameServerToClient["updateSlot"] = (
      playerId,
      sessionId,
    ) => {
      debugSockets &&
        console.debug("SOCKET", "updateSlot", playerId, sessionId);
      setStatus(playerId, sessionId, !!sessionId);
      refreshLog?.();
    };
    const updateWatchPw: GameServerToClient["updateWatchPw"] = (watchKey) => {
      debugSockets && console.debug("SOCKET", "updateWatchPw", watchKey);
      updateGame((game) => game && { ...game, watchKey, watchers: [] });
    };
    const updateWatcher: GameServerToClient["updateWatcher"] = (
      sessionId,
      joined,
      name,
    ) => {
      debugSockets &&
        console.debug("SOCKET", "updateWatcher", sessionId, joined);
      setStatus(null, sessionId, joined, name);
    };
    const updateBan: GameServerToClient["updateBan"] = (data) => {
      debugSockets && console.debug("SOCKET", "updateBan", data);
      banSession(data);
      refreshLog?.();
    };
    const viewedCards: GameServerToClient["viewedCards"] = (
      viewerSessionId,
    ) => {
      if (sessionId === viewerSessionId) setViewed(true);
      refreshLog?.();
    };

    socket.on("updateGame", updateGameListener);
    socket.on("updateName", updateName);
    socket.on("updatePick", updatePick);
    socket.on("updateRound", updateRound);
    socket.on("updateTimer", updateTimer);
    socket.on("updateSlot", updateSlot);
    socket.on("updateBan", updateBan);
    socket.on("updateWatchPw", updateWatchPw);
    socket.on("updateWatcher", updateWatcher);
    socket.on("viewedCards", viewedCards);

    clientErrorsInConsole && socket.on("error", console.error);

    onConnect && socket.on("connect", onConnect);

    reloadData(gameUrl, updateLocal, newError).finally(() => {
      setLoadingAll(0);
      setLoadingPack(0);
    });

    return () => {
      if (!socket) return;

      socket.off("connect", onConnect);
      socket.off("error", console.error);
      socket.off("updateGame", updateGameListener);
      socket.off("updateName", updateName);
      socket.off("updatePick", updatePick);
      socket.off("updateRound", updateRound);
      socket.off("updateTimer", updateTimer);
      socket.off("updateSlot", updateSlot);
      socket.off("updateBan", updateBan);
      socket.off("updateWatchPw", updateWatchPw);
      socket.off("updateWatcher", updateWatcher);
      socket.off("viewedCards", viewedCards);
    };
  };
}

export function useGameEmitters(
  local: LocalRequired,
  newError: (alert: ErrorAlert) => any,
) {
  const { emit, reconnect } = local.socket;

  const renamePlayer: Socket.RenamePlayer = useCallback(
    (name, playerId, byHost = false) => {
      if (!playerId) playerId = local.player?.id;
      if (!playerId)
        return newError(
          formatError("Error renaming player: Player not loaded"),
        );

      name && local.renamePlayer(playerId, name);

      emit("setName", playerId, name, byHost);
    },
    [emit, local.player?.id, local.renamePlayer, newError],
  );

  const setOptions: Socket.SetOptions = useCallback(
    (options) => {
      if (!local.game?.id)
        return newError(formatError("Error renaming game: Game not loaded"));

      emit("setOptions", local.game.id, { ...options });

      if (options?.hostId) delete options.hostId; // Don't force reload until sockets response
      options && local.updateGame((game) => game && { ...game, ...options });
    },
    [emit, local.game?.id, local.updateGame, local.updateLocal, newError],
  );

  const nextRound: Socket.NextRound = useCallback(() => {
    if (!local.game?.id || !("round" in local.game))
      return newError(
        formatError("Error fetching next round: Game not loaded"),
      );

    local.setLoadingPack((v) => v + 1);

    emit("nextRound", local.game.id, local.game.round + 1);
  }, [
    emit,
    local.game?.id,
    (local.game as Game)?.round,
    local.setLoadingPack,
    newError,
  ]);

  const pauseGame: Socket.PauseGame = useCallback(
    (resume = false) => {
      if (!local.game?.id)
        return newError(formatError("Error pausing game: Game not loaded"));

      local.setLoadingAll((v) => v + 1);

      emit("pauseTimer", local.game.id, resume);
    },
    [emit, local.game?.id, local.setLoadingAll, newError],
  );

  const pickCard: Socket.PickCard = useCallback(
    (gameCardOrPack) => {
      if (!local.player?.id)
        return newError(
          formatError("Error picking card: Not connected to server"),
        );

      local.setLoadingPack((v) => v + 1);

      emit("pickCard", local.player.id, gameCardOrPack, (pick?: number) => {
        if (typeof pick !== "number")
          newError(formatError("Error picking: Failed to pick card"));
        return reloadData(
          local.game?.url,
          local.updateLocal,
          newError,
          typeof pick !== "number" ? reconnect : undefined,
        ).finally(() => local.setLoadingPack((v) => v && v - 1));
      });
    },
    [
      emit,
      local.player?.id,
      local.game?.url,
      local.setLoadingPack,
      local.updateLocal,
      newError,
      reconnect,
    ],
  );

  const swapCard: Socket.SwapCard = useCallback(
    (cardId, board) => {
      local.swapCard(cardId, board);

      emit("swapBoards", cardId, board, (cardId, board) => {
        if (!cardId || !board)
          return reloadData(
            local.game?.url,
            local.updateLocal,
            newError,
            reconnect,
          );
        local.swapCard(cardId, board);
      });
    },
    [
      emit,
      local.game?.url,
      local.swapCard,
      local.updateLocal,
      newError,
      reconnect,
    ],
  );

  const setLands: Socket.SetLands = useCallback(
    (lands) => {
      if (!local.player?.id)
        return newError(
          formatError("Error saving lands: Not connected to server"),
        );

      local.setLands(lands);
      emit("setLands", local.player.id, lands, (lands: void | BasicLands) => {
        if (!lands)
          return reloadData(
            local.game?.url,
            local.updateLocal,
            newError,
            reconnect,
          );
        local.setLands(lands);
      });
    },
    [
      emit,
      local.player?.id,
      local.game?.url,
      local.setLands,
      local.updateLocal,
      newError,
      reconnect,
    ],
  );

  const setStatus: Socket.SetStatus = useCallback(
    (playerId, status = PlayerStatus.join, byHost = false) => {
      local.setLoadingAll((v) => v + 1);

      emit("setStatus", playerId, status, byHost, (player?: Player) => {
        reloadData(local.game?.url, local.updateLocal, newError).finally(() =>
          local.setLoadingAll((v) => v && v - 1),
        );
        if (!player) return;

        if (local.sessionId === player.sessionId)
          local.updatePlayer((p) => ({ ...(p || { cards: [] }), ...player }));
        local.setStatus(
          player.id,
          player.sessionId || null,
          !!player.sessionId,
        );
      });
    },
    [
      emit,
      local.game?.url,
      local.sessionId,
      local.setLoadingAll,
      local.setStatus,
      local.updatePlayer,
      local.updateLocal,
      newError,
    ],
  );

  const setWatchPw: Socket.SetWatchPw = useCallback(
    async (password) => {
      if (!local.game?.id)
        return newError(
          formatError("Error setting Watch password: Game not loaded"),
        );

      const encrypted = await hashText(password);
      emit("setWatchPw", local.game.id, encrypted);
    },
    [emit, local.game?.id, newError],
  );

  const dropWatcher: Socket.DropWatcher = useCallback(
    (sessionId) => {
      if (!local.game?.id)
        return newError(
          formatError("Error setting Watch password: Game not loaded"),
        );

      emit("dropWatcher", local.game.id, sessionId, true);
    },
    [emit, local.game?.id, newError],
  );

  const banSession: Socket.BanSession = useCallback(
    (sessionId, unban = false, playerId) => {
      if (!local.game?.id)
        return newError(formatError("Error Banning session: Game not loaded"));

      emit("banSession", local.game.id, sessionId, unban, playerId);
    },
    [emit, local.game?.id, newError],
  );

  return {
    renamePlayer,
    setOptions,
    nextRound,
    pauseGame,
    pickCard,
    swapCard,
    setLands,
    setStatus,
    setWatchPw,
    dropWatcher,
    banSession,
  };
}

export type SocketController = ReturnType<typeof useGameEmitters>;

export type LocalRequired = Pick<
  BasicController,
  | "socket"
  | "player"
  | "game"
  | "sessionId"
  | "updatePlayer"
  | "renamePlayer"
  | "updateGame"
  | "setStatus"
  | "swapCard"
  | "setLands"
  | "updateLocal"
  | "setLoadingPack"
  | "setLoadingAll"
>;
