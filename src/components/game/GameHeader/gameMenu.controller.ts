import type { BasicPlayer } from "types/game"
import { useState } from "react"
import { GameStatus } from "@prisma/client"


export default function useGameMenu(gameStatus?: GameStatus) {
  const [ showMenu, setShowMenu ] = useState<boolean>()
  const [ editingName, setEditingName ] = useState(false)
  
  const enableEdit = editingName ? undefined : () => {
    setEditingName(true)
    setShowMenu(false)
    setTimeout(() => setShowMenu(undefined), 250)
  }

  return {
    hideStats: gameStatus === 'end' || gameStatus === 'start',    
    showMenu, editingName, setEditingName, enableEdit,
  }
}