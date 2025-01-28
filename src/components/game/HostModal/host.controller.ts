import type { Game, PartialGame, Socket } from "types/game";
import { gameIsPaused } from "../shared/game.utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "components/base/services/common.services";
import { hostPlayerTooltips } from "assets/strings";
import { BOT } from "assets/constants";

export default function useHostController(game: Game | PartialGame | undefined, setOptions: Socket.SetOptions) {
    const timerBase = (game as  Game)?.timerBase || 0
    const [ timer, setTimer ] = useState(timerBase)
    useEffect(() => { setTimer(timerBase) }, [timerBase])

    const setOptionsDebounced = useMemo(() => debounce<[number]>(
        (timerBase: number) => setOptions({ timerBase }), 2500),
        [setOptions]
    )

    const updateTimer = useCallback((value: string) => {
        const timer = +value
        setTimer(timer)
        setOptionsDebounced(timer)
    }, [setOptionsDebounced])

    return {
        timer, updateTimer,
        title: game?.name || "",
        setTitle: (name?: string) => name && setOptions({ name }),
        setHost: (hostId?: string) => hostId && setOptions({ hostId }),
        paused: gameIsPaused(game),
    }
}


export function getPlayerButtonData(id: string, sessionId: string | null, isHost: boolean, setStatus: Socket.SetStatus, setHost: SetHost): PlayerButtonData {
  if (isHost) return { icon: "host" }
  if (sessionId === BOT) return { icon: "bot" }

  if (!sessionId) return {
    icon: "empty",
    tooltip: hostPlayerTooltips.setBot,
    action: () => setStatus(id, 'bot', true),
  }

  return {
    icon: "player",
    tooltip: hostPlayerTooltips.setHost,
    action: () => setHost(id),
  }
}

export type IconType = "host" | "empty" | "bot" | "player"
export type SetHost = (hostId: string) => void
export type PlayerButtonData = { icon: IconType, tooltip?: string, action?: () => void }