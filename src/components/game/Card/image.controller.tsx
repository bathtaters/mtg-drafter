import type { CardFull, Direction } from "types/game"
import Image from "next/image"
import { useState, useEffect, useCallback, ReactNode } from "react"
import { showSwapButton, getNextFace } from "./RenderedCard/card.services"
import { HoverAction, useHoverClick } from "components/base/libs/hooks"
import { layoutDirection } from "assets/constants"

export default function useCardImage(card: CardFull, showImages = true) {
  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(card.otherFaces.length ? 0 : -1)

  const cardFace = card.otherFaces[sideIdx - 1]?.card || card
  const direction: Direction | undefined = sideIdx === 1 ? layoutDirection[card.layout || 'normal'] : undefined

  const handleSideChange = useCallback(
    (state: HoverAction) => setSideIdx(state < 2 ? state : (idx) => getNextFace(idx, card.otherFaces.length)),
    [card.otherFaces.length]
  )
  const handleFlip = useHoverClick(handleSideChange)()

  useEffect(() => {
    setImages([card, ...card.otherFaces.map(({ card }) => card)].map(({ uuid, img }, idx) => !!img &&
      <Image key={uuid} src={img} sizes="100vw" fill priority={idx === 0} alt="" />
    ))
  }, [])

  return {
    images, cardFace, handleFlip, direction,
    sideIdx: showSwapButton(card.layout, card.otherFaces.length, showImages) ? sideIdx : -1,
  }
}