import type { CardFull, Direction } from "types/game"
import Image from "next/image"
import { useState, useEffect, useCallback, ReactNode, useMemo } from "react"
import { showFlipButton, getNextFace, isReversible } from "./RenderedCard/card.services"
import { HoverAction, useHoverClick } from "components/base/libs/hooks"
import { layoutDirection } from "assets/constants"

export default function useCardImage(card: CardFull, showImages = true) {
  const cardFaces = useMemo(() => [card, ...card.otherFaces.map(({ card }) => card)], [card.uuid])

  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(card.otherFaces.length ? 0 : -1)

  const direction: Direction | undefined = sideIdx === 1 && card.otherFaces.length === 1 ? layoutDirection[card.layout || 'normal'] : undefined

  const handleSideChange = useCallback(
    (state: HoverAction) => setSideIdx(state < 2 ? state : state === HoverAction.FirstClick ? 1 : (idx) => getNextFace(idx, card.otherFaces.length)),
    [card.otherFaces.length]
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
    reversed: isReversible(card) ? !!sideIdx : undefined,
    sideIdx,
    sideCount: card.otherFaces.length + 1,
    showFlip: showFlipButton(card, showImages),
  }
}