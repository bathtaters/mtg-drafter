import { Fragment, MouseEventHandler } from "react"
import { type CardFull, Direction, TabLabels, Board, PickInfo } from "types/game"
import RenderedCard from "./RenderedCard/RenderedCard"
import { CardWrapper, FlipButton, ImgWrapper, MeldBadge, PickBadge, RotateButton, SwapButton } from "./GameCardStyles"
import useCardImage from "./image.controller"
import { pickInfoText } from "assets/strings"

type Props = {
  card: CardFull,
  isFoil?: boolean,
  container: TabLabels,
  isSelected?: boolean,
  isHighlighted?: boolean,
  showImage?: boolean,
  onClick?: MouseEventHandler,
  onLoad?: () => Promise<void> | void,
  className?: string,
  pickInfo?: PickInfo[string],
}

export default function Card({ card, isFoil, isSelected, isHighlighted, container, showImage, onClick, onLoad, className = '', pickInfo }: Props) {
  const { images, cardFaces, sideIdx, sideCount, direction, reversed, showBadge, showFlip, handleFlip, isRotater, handleRotate } = useCardImage(card, className, showImage, onLoad)
  const isBoard = container in Board

  return (
    <CardWrapper
      isSelected={isSelected} isHighlighted={isHighlighted} isFoil={isFoil} direction={direction} reversed={reversed}
      onClick={!isBoard ? onClick : undefined} className={className}

      image={showImage && images.map((side, idx) => (
        <Fragment key={idx}>
          <ImgWrapper isTop={images.length === 1 || idx === sideIdx} flipSide={typeof reversed === 'boolean' ? idx + 1 : 0}>{side}</ImgWrapper>
          {showBadge && idx === 1 && card.layout === 'meld' && <MeldBadge image={true} />}
        </Fragment>
      ))}

      rendered={sideCount < 3 ? <>
        {/* 1-2 sided cards: */}
        <RenderedCard card={cardFaces[0]} side={sideCount - 1} sideCount={sideCount} isFoil={isFoil} isRotater={isRotater} />
        { sideCount === 2 && <RenderedCard card={cardFaces[1]} side={2} sideCount={sideCount} isFoil={isFoil} /> }
        { !showImage && card.layout === 'meld' && <MeldBadge image={false} /> }
      </>

      : /* 3+ sided cards */
        <RenderedCard card={cardFaces[sideIdx]} side={sideIdx + 1} sideCount={sideCount} isFoil={isFoil}  />
      }
    >
      {showFlip && <FlipButton onClick={handleFlip} isBack={sideIdx > 0} low={card.layout === 'flip'} />}
      {isRotater && sideIdx < 1 && <RotateButton onClick={handleRotate} isRotater={!!direction || direction === Direction.N} />}
      {isBoard && !pickInfo && <SwapButton board={container as Board} onClick={onClick} low={card.layout === 'flip'} />}
      {pickInfo && <PickBadge text={pickInfoText(pickInfo, isBoard)} />}
    </CardWrapper>
  )
}