import type { GameProps } from "types/game"
import type { ColorTheme } from "../PlayerContainers/PlayerContainerStyle"
import { useMemo } from "react"
import { shareGame } from "assets/constants"
import { getGameStatus, getOppIdx, passingRight } from "../shared/game.utils"

export const getPlayerColor = (curr: number, player: number, opp: number | undefined, game: GameProps['options']): ColorTheme => (
  curr === player ? 'self' : game && 'round' in game && game.round > game.roundCount && curr === opp ? 'opp' : undefined
)

export const useSimpleHeader = (game?: GameProps['options']) => ({
  gameStatus: getGameStatus(game),
  isRight: game && passingRight(game),
})

export default function useGameHeader(game: GameProps['options'] | undefined, players: GameProps['players'], playerIdx: number) {
  const gameExists = Boolean(game)
  const oppIdx = useMemo(() => gameExists ? getOppIdx(playerIdx, players.length) : -1, [gameExists, playerIdx, players.length])

  return {
    oppIdx,
    gameStatus: players[playerIdx] ? getGameStatus(game) : undefined,
    isRight: game && players[playerIdx] && passingRight(game),
    copyProps: {
      title: shareGame.title,
      message: shareGame.message,
      url: game ? shareGame.url(game.url) : undefined,
    }
  }
}