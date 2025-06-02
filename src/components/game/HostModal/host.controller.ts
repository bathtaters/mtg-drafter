import { type Game, type Socket, PlayerStatus } from "types/game";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "components/base/libs/storage";
import { debounce } from "components/base/services/common.services";
import { gameIsLocked, gameIsPaused } from "../shared/game.utils";
import { hostPlayerTooltips } from "assets/strings";
import { BOT, shareWatch } from "assets/constants";

export default function useHostController(
  game: Partial<Game> | undefined,
  setOptions: Socket.SetOptions,
  banSession: Socket.BanSession
) {
  // Collapsing sections
  const [expanded, setExpanded] = useLocalStorage<number>("hostModalSection");
  const toggleExpand = useCallback(
    (index?: number) =>
      index
        ? () => setExpanded((value) => (value === index ? 0 : index))
        : () => setExpanded(0),
    [setExpanded]
  );

  // Change timer
  const timerBase = game?.timerBase || 0;
  const [timer, setTimer] = useState(timerBase);
  useEffect(() => {
    setTimer(timerBase);
  }, [timerBase]);

  const setOptionsDebounced = useMemo(
    () =>
      debounce<[number]>(
        (timerBase: number) => setOptions({ timerBase }),
        2500
      ),
    [setOptions]
  );

  const updateTimer = useCallback(
    (value: string) => {
      const timer = +value;
      setTimer(timer);
      setOptionsDebounced(timer);
    },
    [setOptionsDebounced]
  );

  // Banning
  const banned = game?.banned || [];
  const locked = gameIsLocked(game?.id, banned);

  const lockGame = useCallback(
    (unlock?: boolean) => banSession(null, unlock),
    [banSession]
  );
  const banPlayer = useCallback(
    (sessionId?: string | null, unban?: boolean, playerId?: string) => {
      sessionId && banSession(sessionId, unban, playerId);
    },
    [banSession]
  );

  return {
    expanded,
    toggleExpand,
    timer,
    updateTimer,
    watchers: (game as Game)?.watchers,
    banned: banned.length > +locked ? banned : undefined,
    banPlayer,
    locked,
    lockGame,
    title: game?.name || "",
    setTitle: (name?: string) => name && setOptions({ name }),
    setHost: (hostId?: string) => hostId && setOptions({ hostId }),
    paused: gameIsPaused(game),
    copyProps: {
      ...shareWatch,
      url: game?.watchKey && game.url ? shareWatch.url(game.url) : undefined,
    },
  };
}

export function getPlayerButtonData(
  id: string,
  sessionId: string | null,
  isHost: boolean,
  setStatus?: Socket.SetStatus,
  setHost?: SetHost
): PlayerButtonData {
  if (isHost) return { icon: "host" };
  if (sessionId === BOT) return { icon: "bot" };

  if (!sessionId)
    return {
      icon: "empty",
      tooltip: hostPlayerTooltips.setBot,
      action: setStatus
        ? () => setStatus(id, PlayerStatus.bot, true)
        : undefined,
    };

  return {
    icon: "player",
    tooltip: hostPlayerTooltips.setHost,
    action: setHost ? () => setHost(sessionId) : undefined,
  };
}

export type IconType =
  | "host"
  | "empty"
  | "bot"
  | "player"
  | "kick"
  | "ban"
  | "unban";
export type SetHost = (hostId: string) => void;
export type PlayerButtonData = {
  icon: IconType;
  tooltip?: string;
  action?: () => void;
};
