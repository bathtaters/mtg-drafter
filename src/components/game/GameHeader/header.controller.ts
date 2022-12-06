import type { GameProps } from "types/game"
import type { ColorTheme } from "../PlayerContainers/PlayerContainerStyle"
import { useEffect, useMemo, useState } from "react"
import { canShare, shareData } from "components/base/services/common.services"
import { shareGame } from "assets/constants"
import { getGameStatus, getOppIdx, passingRight } from "../shared/game.utils"

export const getPlayerColor = (curr: number, player: number, opp: number | undefined, game: GameProps['options']): ColorTheme => (
  curr === player ? 'self' : game && 'round' in game && game.round > game.roundCount && curr === opp ? 'opp' : undefined
)

export default function useGameHeader(game: GameProps['options'] | undefined, players: GameProps['players'], playerIdx: number) {
  const [ shareable, setShareable ] = useState(false)
  useEffect(() => { setShareable(!!game && canShare()) }, [])
  
  const oppIdx = useMemo(() => game ? getOppIdx(playerIdx, players.length) : -1, [playerIdx, players.length])

  const handleShare = game && shareable ? () => shareData(shareGame.message, shareGame.url(game.url), shareGame.title) : undefined

  return {
    oppIdx, handleShare,
    gameStatus: players[playerIdx] ? getGameStatus(game) : undefined,
    isRight: game && players[playerIdx] && passingRight(game),
    packSize: game && 'packSize' in game ? game.packSize : 0,
  }
}