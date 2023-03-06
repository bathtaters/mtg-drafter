import type { GameProps } from "types/game"
import type { ColorTheme } from "../PlayerContainers/PlayerContainerStyle"
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import { useEffect, useMemo, useState } from "react"
import browserShare, { canShare } from "components/base/libs/share"
import { shareGame } from "assets/constants"
import { sharingMessage } from "assets/strings"
import { getGameStatus, getOppIdx, passingRight } from "../shared/game.utils"

export const getPlayerColor = (curr: number, player: number, opp: number | undefined, game: GameProps['options']): ColorTheme => (
  curr === player ? 'self' : game && 'round' in game && game.round > game.roundCount && curr === opp ? 'opp' : undefined
)

export default function useGameHeader(game: GameProps['options'] | undefined, players: GameProps['players'], playerIdx: number, notify: AlertsReturn['newToast']) {
  const [ shareable, setShareable ] = useState(false)
  const gameExists = Boolean(game)
  
  useEffect(() => { setShareable(gameExists && canShare()) }, [gameExists])
  
  const oppIdx = useMemo(() => gameExists ? getOppIdx(playerIdx, players.length) : -1, [gameExists, playerIdx, players.length])

  const handleShare = !game || !shareable ? undefined : () => browserShare(shareGame.message, shareGame.url(game.url), shareGame.title)
    .then((res) => res in sharingMessage ? notify(sharingMessage[res]) : undefined)

  return {
    oppIdx, handleShare,
    gameStatus: players[playerIdx] ? getGameStatus(game) : undefined,
    isRight: game && players[playerIdx] && passingRight(game),
  }
}