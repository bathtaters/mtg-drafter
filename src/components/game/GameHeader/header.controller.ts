import type { GameProps } from "types/game"
import { useMemo, useState } from "react"
import { shareGame } from "assets/constants"
import { getGameStatus, getAllIndexes, passingRight } from "../shared/game.utils"

export const useSimpleHeader = (game?: GameProps['options']) => ({
  gameStatus: getGameStatus(game),
})

export default function useGameHeader(game: GameProps['options'] | undefined, players: GameProps['players'], playerIdx: number, isHost: boolean) {
  const [ showMenu, setShowMenu ] = useState<boolean>()
  const [ editingName, setEditingName ] = useState(false)
  const showDetail = Boolean(players[playerIdx] || isHost)
  
  const enableEdit = isHost && !players[playerIdx] ? undefined : editingName ? false as const : () => {
    setEditingName(true)
    setShowMenu(false)
    setTimeout(() => setShowMenu(undefined), 250)
  }
  
  const gameStatus = showDetail ? getGameStatus(game) : undefined

  const indexes = useMemo(() =>
    gameStatus ? getAllIndexes(playerIdx, players.length) : undefined,
    [gameStatus, playerIdx, players.length]
  )

  return {
    gameStatus, indexes, showDetail,
    showMenu, editingName, setEditingName, enableEdit,
    hideStats: gameStatus === undefined || gameStatus === 'end' || gameStatus === 'start',
    isRight: game && showDetail && passingRight(game),
    copyProps: {
      title: shareGame.title,
      message: shareGame.message,
      url: game ? shareGame.url(game.url) : undefined,
    }
  }
}