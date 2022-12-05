import type { MouseEventHandler } from "react"
import type { CardFull } from "types/game"
import { Board, TabLabels } from "@prisma/client"
import RenderedCard from "./RenderedCard/RenderedCard"
import { CardWrapper, FlipButton, ImgWrapper, SwapButton } from "./GameCardStyles"
import useCardImage from "./image.controller"

type Props = {
  card: CardFull,
  container: TabLabels,
  isSelected?: boolean,
  showImage?: boolean,
  onClick?: MouseEventHandler,
  className?: string,
}

export default function CardDisplay({ card, isSelected, container, showImage, onClick, className = '' }: Props) {
  const { images, sideIdx, cardFace, handleFlip, isRotated } = useCardImage(card)
  const isBoard = container in Board

  return (
    <CardWrapper isSelected={isSelected} onClick={!isBoard ? onClick : undefined} className={className}>
      {showImage && <ImgWrapper rotate={isRotated}>{images[sideIdx < 0 ? 0 : sideIdx]}</ImgWrapper>}
      <RenderedCard card={cardFace} />
      {sideIdx >= 0 && <FlipButton onClick={handleFlip} isBack={sideIdx > 0} />}
      {isBoard && <SwapButton board={container as Board} onClick={onClick} />}
    </CardWrapper>
  )
}