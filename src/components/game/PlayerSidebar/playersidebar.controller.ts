import type { GameProps } from "types/game"
import type { ColorTheme } from "../PlayerContainers/PlayerContainerStyle"
import { useMemo } from "react"
import { getGameStatus, getOppIdx, passingRight } from "../shared/game.utils"

export const getPlayerColor = (curr: number, player: number, opp: number | undefined, game: GameProps['options']): ColorTheme => (
    curr === player ? 'self' : game && curr === opp ? 'opp' : undefined
)

export default function usePlayerSidebar(game: GameProps['options'] | undefined, players: GameProps['players'], playerIdx: number) {
    const gameExists = Boolean(game)
    const oppIdx = useMemo(() => gameExists ? getOppIdx(playerIdx, players.length) : -1, [gameExists, playerIdx, players.length])
    const gameStatus = getGameStatus(game)
    
    return {
        oppIdx,
        hideStats: gameStatus === 'end' || gameStatus === 'start',
        passRight: game && passingRight(game),
    }
}