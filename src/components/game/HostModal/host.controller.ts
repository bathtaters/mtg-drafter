import type { Game, PartialGame, Socket } from "types/game";
import { gameIsPaused } from "../shared/game.utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "components/base/services/common.services";


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
        paused: gameIsPaused(game),
    }
}