import type { Player } from "@prisma/client"
import { useState } from "react"


export default function usePlayerMenu(player: Player, maxPick: number, holding?: number, hideStats = false) {
  const [ showMenu, setShowMenu ] = useState<boolean>()
  const [ editingName, setEditingName ] = useState(false)
  
  const enableEdit = editingName ? undefined : () => {
    setEditingName(true)
    setShowMenu(false)
    setTimeout(() => setShowMenu(undefined), 250)
  }

  return {
    pickValue: hideStats || !player?.pick || player.pick > maxPick ? undefined : player.pick,
    holdingValue: hideStats ? undefined : typeof holding === 'number' ? Math.max(holding,0) : holding,
    
    showMenu, editingName, setEditingName, enableEdit,
  }
}