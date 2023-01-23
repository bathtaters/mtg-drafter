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
  const { images, cardFaces, sideIdx, sideCount, direction, reversed, showFlip, handleFlip } = useCardImage(card, showImage)
  const isBoard = container in Board

  return (
    <CardWrapper
      isSelected={isSelected} isHighlighted={isHighlighted} isFoil={isFoil} direction={direction} reversed={reversed}
      onClick={!isBoard ? onClick : undefined} className={className}

      image={showImage && images.map((side, idx) => <>
        <ImgWrapper isTop={images.length === 1 || idx === sideIdx} flipSide={typeof reversed === 'boolean' ? idx + 1 : 0} key={idx}>{side}</ImgWrapper>
        {idx === 1 && card.layout === 'meld' && <MeldBadge image={true} />}
      </>
      )}

      rendered={sideCount <= 2 ? <>
        {/* 1-2 sided cards: */}
        <RenderedCard card={cardFaces[0]} side={sideCount - 1} sideCount={sideCount} isFoil={isFoil}  />
        { sideCount === 2 && <RenderedCard card={cardFaces[1]} side={2} sideCount={sideCount} isFoil={isFoil} /> }
        { !showImage && card.layout === 'meld' && <MeldBadge image={false} /> }
      </>

      : /* 3+ sided cards */
        <RenderedCard card={cardFaces[sideIdx]} side={sideIdx + 1} sideCount={sideCount} isFoil={isFoil}  />
      }
    >
      {showFlip && <FlipButton onClick={handleFlip} isBack={sideIdx > 0} low={card.layout === 'flip'} />}
      {isBoard && <SwapButton board={container as Board} onClick={onClick} low={card.layout === 'flip'} />}
    </CardWrapper>
  )
}