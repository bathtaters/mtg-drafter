import type { CardFull } from "types/game"
import { useState, MouseEventHandler, useEffect, ReactNode } from "react"
import Image from "next/image"


export default function useCardImage(card: CardFull, showImages = true) {
  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(card.side ? 0 : -1)

  const cardFace = card.otherFaces[sideIdx - 1] || card
  const isRotated = sideIdx > 0 && card.img === cardFace.img

  const handleFlip: MouseEventHandler = (ev) => {
    ev.stopPropagation()
    setSideIdx((sideIdx + 1) % (card.otherFaces.length + 1))
  }

  useEffect(() => {
    setImages([card, ...card.otherFaces].map(({ img }) => showImages && !!img &&
      <Image src={img} layout="fill" priority={true} alt="" />
    ))
  }, [])

  return { images, sideIdx, cardFace, handleFlip, isRotated }
}