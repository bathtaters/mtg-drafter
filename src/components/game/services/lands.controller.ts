import type { Dispatch, SetStateAction } from "react"
import type { BasicLands } from "types/definitions"
import type { GameCardFull } from "./game"
import { useState } from "react"
import getAutoLands from "./autoLands"
import { getObjectSum } from "components/base/services/common.services"
import { useLocalStorage } from "components/base/services/storage.services"


export default function useLandsModal({ basics, cards, setOpen, onSubmit = () => {} }: LandsModalProps) {
  const [localLands, setLocalLands] = useState(basics)
  const [deckSize,   setDeckSize  ] = useLocalStorage('deckSize')
  const [sideLands,  setSideLands ] = useLocalStorage('sideboardLands')

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

  
  return {
    localLands, handleSave, handleCancel,

    autoLandsProps: {
      onClick: setAutoLands,
      deckSize, setDeckSize,
      sideLands, setSideLands,
    },

    landSums: ['', getObjectSum(localLands.main), getObjectSum(localLands.side)],

    mainChange: (color: string) => (value: number) => setLocalLands((lands: BasicLands) => ({ ...lands, [color]: value })),
    sideChange: (color: string) => (value: number) => setLocalLands((lands: BasicLands) => ({ ...lands, [color]: value })),
  }
}

export type LandsModalProps = {
  basics: BasicLands,
  cards?: GameCardFull[],
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onSubmit?: (basics: BasicLands) => void
}