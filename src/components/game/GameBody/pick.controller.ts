import type { MouseEvent } from "react"
import type { GameCard, Board, Game, TabLabels } from "@prisma/client"
import type { CardOptions, PackFull, PartialGame, PickCard, PlayerFull, SwapCard } from "types/game"
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import { useCallback, useRef, useState, useEffect } from "react"
import { useTimer } from "components/base/libs/hooks"
import getAutopickCard from "components/base/services/autoPick.service"
import { redTimerSeconds } from "assets/constants"

const DBL_CLICK_DELAY = 500

export default function usePickController(
  pickCard: PickCard, swapCard: SwapCard, notify: AlertsReturn['newToast'],
  pack?: PackFull, game?: Game|PartialGame, player?: PlayerFull,
) {
  const hidePack = !game || !('round' in game) || game.round > game.roundCount || game.round < 1

  const lastClick = useRef(-1)
  const [ selectedTab,  selectTab       ] = useState<TabLabels>(hidePack ? 'main' : 'pack')
  const [ selectedCard, setSelectedCard ] = useState<GameCard['id']>()
  const [ autopickCard, setAutopickCard ] = useState(pack && getAutopickCard(pack, player?.cards))
  const [ cardOptions,  setCardOptions  ] = useState<CardOptions>({ width: '', showArt: true, sort: undefined })
  
  const autoPick = useCallback(() => {
    if (!autopickCard) return;
    pickCard(selectedCard || autopickCard)
    setSelectedCard(undefined)
    setAutopickCard(undefined)
  }, [autopickCard, selectedCard, pickCard])


  const clickPickButton = useCallback(() => {
    if (typeof pack?.index !== 'number') return notify({ message: 'Cannot pick without a pack.', theme: 'error' })
    if (!selectedCard) return notify({ message: 'Cannot pick before selecting a card.', theme: 'error' })
    pickCard(selectedCard)
    setSelectedCard(undefined)
    setAutopickCard(undefined)
  }, [selectedCard, pack])


  const clickPackCard = useCallback((id: GameCard['id'], ev: MouseEvent) => {
    ev.stopPropagation()
    if (ev.detail > 1 && id === selectedCard && lastClick.current + DBL_CLICK_DELAY > ev.timeStamp) return clickPickButton()
    if (id === selectedCard) lastClick.current = ev.timeStamp
    setSelectedCard(id)
    ev.preventDefault()
  }, [selectedCard, clickPickButton])


  const clickBoardCard = useCallback((board: Board) => (id: GameCard['id'], ev: MouseEvent) => {
    swapCard(id, board === 'side' ? 'main' : 'side')
    ev.preventDefault()
  }, [swapCard])


  const deselectCard = useCallback(() => { setSelectedCard(undefined) }, [])


  const timer = useTimer(player?.timer, autoPick)

  useEffect(() => { if (hidePack && selectedTab === 'pack') selectTab('main') }, [hidePack])
  
  useEffect(() => {
    if (typeof pack?.index === 'number') {
      selectTab('pack')
      setAutopickCard(getAutopickCard(pack, player?.cards))
    }
  }, [pack, player?.id])

  return {
    autopickCard: timer && timer < redTimerSeconds ? autopickCard : undefined,
    selectedCard, deselectCard,
    clickPickButton, clickPackCard, clickBoardCard,
    cardOptions, setCardOptions,
    selectedTab, selectTab, hidePack, timer,
  }
}