import type { MouseEvent } from "react"
import type { GameCard, Board } from "@prisma/client"
import type { PackFull, PickCard, SwapCard } from "./game"
import { useCallback, useRef, useState } from "react"

const DBL_CLICK_DELAY = 500

export default function usePickController(pickCard: PickCard, swapCard: SwapCard, pack?: PackFull) {

  const lastClick = useRef(-1)
  const [ selectedCard, setSelectedCard ] = useState(-1)
  const [ cardWidth, setCardWidth ] = useState('')

  const clickPickButton = useCallback(() => {
    if (!pack) return console.warn('Player attempting to pick without a pack')
    pickCard(selectedCard)
    setSelectedCard(-1)
  }, [selectedCard])


  const clickPackCard = useCallback((_: any, idx: number, ev: MouseEvent) => {
    ev.stopPropagation()
    if (ev.detail > 1 && idx === selectedCard && lastClick.current + DBL_CLICK_DELAY > ev.timeStamp) return clickPickButton()
    if (idx === selectedCard) lastClick.current = ev.timeStamp
    setSelectedCard(idx)
    ev.preventDefault()
  }, [selectedCard, clickPickButton])


  const clickBoardCard = useCallback((board: Board) => (id: GameCard['id'], idx: number, ev: MouseEvent) => {
    swapCard(id, board === 'side' ? 'main' : 'side')
    ev.preventDefault()
  }, [swapCard])


  const deselectCard = useCallback(() => { setSelectedCard(-1) }, [])

  return { selectedCard, deselectCard, clickPickButton, clickPackCard, clickBoardCard, cardWidth, setCardWidth }
}