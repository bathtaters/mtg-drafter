import type { GameProps } from "types/game"
import type { ColorTheme } from "../PlayerContainers/PlayerContainerStyle"
import { useEffect, useMemo, useState } from "react"
import { canShare, shareData } from "components/base/services/common.services"
import { shareGame } from "assets/constants"
import { getOppIdx, getRound, passingRight } from "../shared/game.utils"

export const getPlayerColor = (curr: number, player: number, opp: number | undefined, game: GameProps['options']): ColorTheme => (
  curr === player ? 'self' : game && game.round > game.roundCount && curr === opp ? 'opp' : undefined 
)

export default function useGameHeader(game: GameProps['options'] | undefined, players: GameProps['players'], playerIdx: number) {
  const [ shareable, setShareable ] = useState(false)
  useEffect(() => { setShareable(!!game && canShare()) }, [])
  
  const oppIdx = useMemo(() => game ? getOppIdx(playerIdx, players.length) : -1, [playerIdx, players.length])

  const handleShare = game && shareable ? () => shareData(shareGame.message, shareGame.url(game.url), shareGame.title) : undefined

  return {
    oppIdx, handleShare,
    round: game ? getRound(game) : 'Awaiting',
    isRight: game && passingRight(game),
  }
}