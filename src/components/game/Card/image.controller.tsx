import type { CardFull, Direction } from "types/game"
import Image from "next/image"
import { useState, useEffect, useCallback, ReactNode, useMemo } from "react"
import { showFlipButton, getNextFace, isReversible } from "./RenderedCard/card.services"
import { HoverAction, useHoverClick } from "components/base/libs/hooks"
import { layoutDirection } from "assets/constants"

export default function useCardImage(card: CardFull, showImages = true) {
  const cardFaces = useMemo(() => [card, ...card.otherFaces.map(({ card }) => card)], [card.uuid])
  const sideCount = cardFaces.length

  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(sideCount > 1 ? 0 : -1)

  const direction: Direction | undefined = sideIdx === 1 && sideCount === 2 ? layoutDirection[card.layout || 'normal'] : undefined

  const handleSideChange = useCallback(
    sideCount < 3 ?
      // Normal action
      (state: HoverAction) => setSideIdx(
        state < HoverAction.Click ? state :
        state === HoverAction.FirstClick ? 1 :
          (idx) => getNextFace(idx, sideCount)
      )
    :
      // 3+ Faced Card
      (state: HoverAction) => state !== HoverAction.Leave && 
        setSideIdx((idx) => getNextFace(idx, sideCount)),
    [sideCount]
  )
  const handleFlip = useHoverClick(handleSideChange)()

  // Pre-load images
  useEffect(() => {
    setImages(cardFaces
      .filter(({ img }, idx) => img && (!idx || img !== card.img))
      .map(({ uuid, img }, idx) =>  <Image key={uuid} src={img as string} sizes="100vw" fill priority={!idx} alt="" /> )
    )
  }, [cardFaces])

  return {
    images, cardFaces, handleFlip, direction,
    sideIdx, sideCount,
    reversed: isReversible(card) ? !!sideIdx : undefined,
    showFlip: showFlipButton(card, showImages),
  }
}