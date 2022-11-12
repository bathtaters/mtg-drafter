import type { CardFull } from "types/game"
import { useState, MouseEventHandler, useEffect, ReactNode } from "react"
import Image from "next/image"


export default function useCardImage(card: CardFull, showImages = true) {
  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(card.side ? 0 : -1)
  const cardFace = card.otherFaces[sideIdx - 1] || card
  
  const handleFlip: MouseEventHandler = (ev) => {
    ev.stopPropagation()
    setSideIdx((sideIdx + 1) % (card.otherFaces.length + 1))
  }

  useEffect(() => {
    setImages([card, ...card.otherFaces].map(({ img }) => showImages && !!img &&
      <Image src={img} className="absolute top-0 bottom-0 left-0 right-0 z-20 rounded-[5%]" layout="fill" priority={true} />
    ))
  }, [])

  return { images, sideIdx, cardFace, handleFlip }
}