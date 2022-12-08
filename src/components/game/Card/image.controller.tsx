import type { CardFull } from "types/game"
import { useState, MouseEventHandler, useEffect, ReactNode, useRef } from "react"
import Image from "next/image"

const POST_CLICK_DELAY = 5 * 1000

const getNext = (current: number, other: number) => (current + 1) % (other + 1)

export default function useCardImage(card: CardFull, showImages = true) {
  const disableMouseOver = useRef(false)
  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(card.side ? 0 : -1)

  const cardFace = card.otherFaces[sideIdx - 1] || card
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
        setSideIdx(getNext(sideIdx, card.otherFaces.length))
    }
  }

  useEffect(() => {
    setImages([card, ...card.otherFaces].map(({ img }) => showImages && !!img &&
      <Image src={img} layout="fill" priority={true} alt="" />
    ))
  }, [])

  return { images, sideIdx, cardFace, handleFlip, isRotated }
}