import type { GameProps } from "types/game"
import { useMemo, useState } from "react"
import { shareGame } from "assets/constants"
import { getGameStatus, getAllIndexes, passingRight } from "../shared/game.utils"

export const useSimpleHeader = (game?: GameProps['options']) => ({
  gameStatus: getGameStatus(game),
})

export default function useGameHeader(game: GameProps['options'] | undefined, players: GameProps['players'], playerIdx: number) {
  const [ showMenu, setShowMenu ] = useState<boolean>()
  const [ editingName, setEditingName ] = useState(false)
  
  const enableEdit = editingName ? undefined : () => {
    setEditingName(true)
    setShowMenu(false)
    setTimeout(() => setShowMenu(undefined), 250)
  }

  const gameStatus = players[playerIdx] ? getGameStatus(game) : undefined

  const indexes = useMemo(() =>
    gameStatus ? getAllIndexes(playerIdx, players.length) : undefined,
    [gameStatus, playerIdx, players.length]
  )

  return {
    gameStatus, indexes,
    showMenu, editingName, setEditingName, enableEdit,
    hideStats: gameStatus === undefined || gameStatus === 'end' || gameStatus === 'start',
    isRight: game && players[playerIdx] && passingRight(game),
    copyProps: {
      title: shareGame.title,
      message: shareGame.message,
      url: game ? shareGame.url(game.url) : undefined,
    }
  }
}