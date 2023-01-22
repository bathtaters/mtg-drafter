import type { MouseEventHandler } from "react"
import type { CardFull } from "types/game"
import { Board, TabLabels } from "@prisma/client"
import RenderedCard from "./RenderedCard/RenderedCard"
import { CardWrapper, FlipButton, ImgWrapper, MeldBadge, SwapButton } from "./GameCardStyles"
import useCardImage from "./image.controller"

type Props = {
  card: CardFull,
  isFoil?: boolean,
  container: TabLabels,
  isSelected?: boolean,
  isHighlighted?: boolean,
  showImage?: boolean,
  onClick?: MouseEventHandler,
  className?: string,
}

export default function CardDisplay({ card, isFoil, isSelected, isHighlighted, container, showImage, onClick, className = '' }: Props) {
  const { images, sideIdx, cardFace, handleFlip, isRotated } = useCardImage(card, showImage)
  const isBoard = container in Board

  return (
    <CardWrapper isSelected={isSelected} isHighlighted={isHighlighted} isFoil={isFoil} onClick={!isBoard ? onClick : undefined} className={className}>
      {showImage && images.map((side, idx) => 
        <ImgWrapper rotate={isRotated} isTop={sideIdx < 0 || idx === sideIdx} key={idx}>{side}</ImgWrapper>
      )}
      <RenderedCard card={cardFace} isFoil={isFoil} otherFaceCount={card.otherFaces.length} />
      {sideIdx >= 0 && <FlipButton onClick={handleFlip} isBack={sideIdx > 0} />}
      {isBoard && <SwapButton board={container as Board} onClick={onClick} />}
      {showImage && sideIdx > 0 && card.layout === 'meld' && <MeldBadge />}
    </CardWrapper>
  )
}