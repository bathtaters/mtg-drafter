import { MouseEventHandler } from "react"
import { CardWrapper } from "../styles/GameCardStyles"

export default function CardDisplay({ card, isSelected, onClick }: { card: string, isSelected?: boolean, onClick?: MouseEventHandler }) {
  return <CardWrapper isSelected={isSelected} onClick={onClick}>{card}</CardWrapper>
}