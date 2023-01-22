import type { CardFull } from "types/game"
import { useState, useEffect, useCallback, ReactNode } from "react"
import Image from "next/image"
import { showSwapButton, getNextFace } from "./RenderedCard/card.services"
import { HoverAction, useHoverClick } from "components/base/libs/hooks"


export default function useCardImage(card: CardFull, showImages = true) {
  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(showSwapButton(card.side, card.layout, showImages) ? 0 : -1)
  // sideIdx of -1 = hide swap card button

  useEffect(() => {
    setSideIdx((idx) => !showSwapButton(card.side, card.layout, showImages) ? -1 : idx < 0 ? 0 : idx)
  }, [card.side, card.layout, showImages])

  const cardFace = card.otherFaces[sideIdx - 1]?.card || card
  const isRotated = sideIdx > 0 && card.img === cardFace.img

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

  return { images, sideIdx, cardFace, handleFlip, isRotated }
}