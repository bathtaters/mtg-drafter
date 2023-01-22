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
  const { images, sideIdx, cardFace, handleFlip, direction } = useCardImage(card, showImage)
  const isBoard = container in Board

  return (
    <CardWrapper
      isSelected={isSelected} isHighlighted={isHighlighted} isFoil={isFoil} direction={direction}
      onClick={!isBoard ? onClick : undefined} className={className}

      image={showImage && images.map((side, idx) => 
        <ImgWrapper isTop={sideIdx < 0 || idx === sideIdx} key={idx}>{side}</ImgWrapper>
      )}

      rendered={<>
        <RenderedCard card={cardFace[0]} isFoil={isFoil} otherFaceCount={card.otherFaces.length} splitSide={+!!cardFace[1] as 0|1} />
        {1 in cardFace && <RenderedCard card={cardFace[1]} isFoil={isFoil} otherFaceCount={card.otherFaces.length} splitSide={2} />}
      </>}
    >
      {sideIdx >= 0 && <FlipButton onClick={handleFlip} isBack={sideIdx > 0} low={card.layout === 'flip'} />}
      {isBoard && <SwapButton board={container as Board} onClick={onClick} low={card.layout === 'flip'} />}
      {showImage && sideIdx > 0 && card.layout === 'meld' && <MeldBadge />}
    </CardWrapper>
  )
}