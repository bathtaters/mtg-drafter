import type { Game, PartialGame, Socket } from "types/game"
import { useCallback, useEffect, useMemo, useState } from "react"
import { debounce } from "components/base/services/common.services"
import { gameIsPaused } from "../shared/game.utils"
import { hostPlayerTooltips } from "assets/strings"
import { BOT, shareWatch } from "assets/constants"

export default function useHostController(game: Game | PartialGame | undefined, setOptions: Socket.SetOptions, setStatus: Socket.SetStatus) {
  // Collapsing sections
  const [ expanded, setExpanded ] = useState(0)
  const toggleExpand = useCallback((index?: number) => index ? () => setExpanded((value) => value === index ? 0 : index) : () => setExpanded(0), [])

  // Change timer
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

  // Banning
  const banned = (game as Game)?.banned || []
  const locked = banned.some(({ sessionId }) => !sessionId)

  const lockGame = useCallback((unlock?: boolean, note?: string) => {
    console.error("NOT IMPLEMENTED:", unlock ? "Unlock" : "Lock", game?.id, note)
  }, [])
  const kickWatcher = useCallback((sessionId?: string | null) => {
    sessionId && console.error("NOT IMPLEMENTED:", "Kick", game?.id, sessionId)
  }, [])
  const banPlayer = useCallback((sessionId?: string | null, unban?: boolean, note?: string) => {
    sessionId && console.error("NOT IMPLEMENTED:", unban ? "Unban" : "Ban", game?.id, sessionId, note)
  }, [])

  return {
    expanded, toggleExpand,
    timer, updateTimer,
    watchers: (game as Game)?.watchers,
    kickWatcher, 
    banned: banned.length > +locked ? banned : undefined,
    banPlayer, 
    locked, lockGame,
    title: game?.name || "",
    setTitle: (name?: string) => name && setOptions({ name }),
    setHost: (hostId?: string) => hostId && setOptions({ hostId }),
    paused: gameIsPaused(game),
    copyProps: { ...shareWatch, url: game?.watchKey ? shareWatch.url(game?.url) : undefined },
  }
}


export function getPlayerButtonData(id: string, sessionId: string | null, isHost: boolean, setStatus?: Socket.SetStatus, setHost?: SetHost): PlayerButtonData {
  if (isHost) return { icon: "host" }
  if (sessionId === BOT) return { icon: "bot" }

  if (!sessionId) return {
    icon: "empty",
    tooltip: hostPlayerTooltips.setBot,
    action: setStatus ? () => setStatus(id, 'bot', true) : undefined,
  }

  return {
    icon: "player",
    tooltip: hostPlayerTooltips.setHost,
    action: setHost ? () => setHost(id) : undefined,
  }
}

export type IconType = "host" | "empty" | "bot" | "player" | "kick" | "ban" | "unban"
export type SetHost = (hostId: string) => void
export type PlayerButtonData = { icon: IconType, tooltip?: string, action?: () => void }