import type { Dispatch, SetStateAction } from "react"
import type { BasicLands, BoardLands, GameCardFull } from "types/game"
import type { Board } from "@prisma/client"
import { useState } from "react"
import { useLocalStorage } from "components/base/libs/storage"
import { getObjectSum } from "components/base/services/common.services"
import getAutoLands from "./autoLands.service"


export default function useLandsModal({ basics, cards, setOpen, onSubmit = () => {} }: LandsModalProps) {
  const [localLands, setLocalLands] = useState(basics)
  const [deckSize,   setDeckSize  ] = useLocalStorage<number>('deckSize')
  const [sideLands,  setSideLands ] = useLocalStorage<number>('sideboardLands')

  const setAutoLands = () => {
    if (!cards) return;
    const lands = getAutoLands(cards, deckSize, sideLands)
    if (!lands || !lands.main || !lands.side) return;
    setLocalLands(lands)
  }

  const handleSave = () => {
    onSubmit && onSubmit(localLands)
    setOpen((st) => !st)
  }

  const handleCancel = () => {
    setLocalLands(basics)
    setOpen((st) => !st)
  }

  const landChange = (board: Board, color: keyof BoardLands) => (value: number) => {
    setLocalLands((lands) => ({
      ...lands, [board]: {
        ...lands[board], [color]: value
      }
    }))
  }

  
  return {
    localLands, handleSave, handleCancel, landChange,

    autoLandsProps: {
      onClick: setAutoLands,
      deckSize, setDeckSize,
      sideLands, setSideLands,
    },

    landSums: ['', getObjectSum(localLands.main), getObjectSum(localLands.side)],
  }
}

export type LandsModalProps = {
  basics: BasicLands,
  cards?: GameCardFull[],
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onSubmit?: (basics: BasicLands) => void
}