import type { CardFull } from "types/game"
import { useState, MouseEventHandler, useEffect, ReactNode, useRef } from "react"
import Image from "next/image"
import { showSwapButton, getNextFace } from "./RenderedCard/card.services"

const POST_CLICK_DELAY = 5 * 1000

export default function useCardImage(card: CardFull, showImages = true) {
  const disableMouseOver = useRef(false)
  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(showSwapButton(card.side, card.layout, showImages) ? 0 : -1)

  useEffect(() => {
    // Set to -1 to hide reverse card button
    setSideIdx((idx) => !showSwapButton(card.side, card.layout, showImages) ? -1 : idx < 0 ? 0 : idx)
  }, [card.side, card.layout, showImages])

  const cardFace = card.otherFaces[sideIdx - 1]?.card || card
  const isRotated = sideIdx > 0 && card.img === cardFace.img

  const handleFlip: MouseEventHandler = (ev) => {
    ev.stopPropagation()

    switch (ev.type) {
      case 'mouseenter':
        disableMouseOver.current !== true && setSideIdx(1)
        break
      case 'mouseleave':
        disableMouseOver.current !== true && setSideIdx(0)
        break
      case 'click':
        disableMouseOver.current = true
        setTimeout(() => disableMouseOver.current = false, POST_CLICK_DELAY)
      default:
        setSideIdx(getNextFace(sideIdx, card.otherFaces.length))
    }
  }

  useEffect(() => {
    setImages([card, ...card.otherFaces.map(({ card }) => card)].map(({ uuid, img }, idx) => !!img &&
      <Image key={uuid} src={img} sizes="100vw" fill priority={idx === 0} alt="" />
    ))
  }, [])

  return { images, sideIdx, cardFace, handleFlip, isRotated }
}