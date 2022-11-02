import type { MouseEventHandler } from "react"
import type { CardFull } from "types/game"
import FauxCard from "./FauxCard"
import { CardWrapper, FlipButton } from "./GameCardStyles"
import useCardImage from "./image.controller"

type Props = { card: CardFull, isSelected?: boolean, showImage?: boolean, onClick?: MouseEventHandler, className?: string }

export default function CardDisplay({ card, isSelected, showImage, onClick, className = '' }: Props) {
  const { images, sideIdx, cardFace, handleFlip } = useCardImage(card)

  return (
    <CardWrapper isSelected={isSelected} onClick={onClick} className={className}>
      {showImage && images[sideIdx < 0 ? 0 : sideIdx]}
      <FauxCard card={cardFace} />
      {sideIdx >= 0 && <FlipButton onClick={handleFlip} isBack={sideIdx > 0} />}
    </CardWrapper>
  )
}