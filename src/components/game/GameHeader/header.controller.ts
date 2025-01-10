import type { GameProps } from "types/game"
import { useState } from "react"
import { shareGame } from "assets/constants"
import { getGameStatus, passingRight } from "../shared/game.utils"

export const useSimpleHeader = (game?: GameProps['options']) => ({
  gameStatus: getGameStatus(game),
  isRight: game && passingRight(game),
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

  return {
    gameStatus,
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