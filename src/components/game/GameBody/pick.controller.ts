import { MouseEvent, useEffect } from "react"
import type { GameCard, Board, Game } from "@prisma/client"
import type { CardOptions, PackFull, PickCard, SwapCard, TabLabels } from "types/game"
import { useCallback, useRef, useState } from "react"

const DBL_CLICK_DELAY = 500

export default function usePickController(pickCard: PickCard, swapCard: SwapCard, pack?: PackFull, game?: Game) {
  const hidePack = !game || game.round > game.roundCount || game.round < 1

  const lastClick = useRef(-1)
  const [ selectedTab,  selectTab       ] = useState<TabLabels>(hidePack ? 'main' : 'pack')
  const [ selectedCard, setSelectedCard ] = useState(-1)
  const [ cardOptions,  setCardOptions  ] = useState<CardOptions>({ width: '', showArt: true, sort: undefined })

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

  useEffect(() => { if (hidePack && selectedTab === 'pack') selectTab('main') }, [hidePack])

  return {
    selectedCard, deselectCard,
    clickPickButton, clickPackCard, clickBoardCard,
    cardOptions, setCardOptions,
    selectedTab, selectTab, hidePack,
  }
}