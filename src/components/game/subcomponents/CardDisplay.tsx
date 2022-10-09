import type { MouseEventHandler } from "react"
import type { CardFull } from "../services/game"
import { CardWrapper } from "../styles/GameCardStyles"
import FauxCard from "./FauxCard"

type Props = { card: CardFull, isSelected?: boolean, onClick?: MouseEventHandler, className?: string }

export default function CardDisplay({ card, isSelected, onClick, className = '' }: Props) {
  return (
    <CardWrapper isSelected={isSelected} onClick={onClick} className={className}>
      <FauxCard card={card} />
    </CardWrapper>
  )
}