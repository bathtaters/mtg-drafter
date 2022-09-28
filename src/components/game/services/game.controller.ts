import { MouseEvent, useCallback, useMemo, useRef, useState } from "react"
import { Game } from '../../../models/Game'
import { getPackIdx, getPrevPlayerIdx } from './game.utils'

const DBL_CLICK_DELAY = 500

export default function useGameController(game: Game, playerIdx: number) {

  const lastClick = useRef(-1)
  const [ selectedCard, setSelectedCard ] = useState(-1)

  const neighborIdx = useMemo(() => getPrevPlayerIdx(game, playerIdx), [game.round])
  const packIdx = getPackIdx(game, playerIdx, neighborIdx)
  

  const pickCard = useCallback(() => {
    if (typeof packIdx !== 'number') return console.warn('PackIdx is not defined')
    console.log('Picked card:',game.packs[packIdx][selectedCard]) // Send pick to server
    setSelectedCard(-1)
  }, [selectedCard, setSelectedCard])


  const clickPackCard = useCallback((idx: number, ev: MouseEvent) => {
    if (ev.detail > 1 && idx === selectedCard && lastClick.current + DBL_CLICK_DELAY > ev.timeStamp) return pickCard()
    if (idx === selectedCard) lastClick.current = ev.timeStamp
    setSelectedCard(idx)
  }, [selectedCard, pickCard, setSelectedCard])


  const clickBoardCard = useCallback((board: "main"|"side") => (idx: number, ev: MouseEvent) => {
    // Send clicking board card to server
    console.log('Move card',game.players[playerIdx][board === 'side' ? 'sideBoard' : 'mainBoard'][idx],'to',board === 'side' ? 'mainBoard' : 'sideBoard')
  }, [])


  return {
    selectedCard, packIdx,
    pickCard, clickPackCard, clickBoardCard,
  }
}