import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import type { CardFull } from "../services/game"
import CardDisplay from "./CardDisplay"
import { CardContainerWrapper } from "../styles/CardContainerStyles"
import { CardsWrapper, NoCards } from "../styles/GameCardStyles"
import { BoardLands } from "types/definitions"
import ContainerHeader from "./CardContainerHeader"

type Props = {
  label: ReactNode,
  cards?: { id: string, card: CardFull }[],
  lands?: BoardLands,
  open?: boolean,
  children?: ReactNode,
  onClick?: (id: string, idx: number, event: MouseEvent) => void,
  onBgdClick?: MouseEventHandler,
  selectedIdx?: number,
  cardWidth: string,
}

export default function CardContainer({ label, cards, lands, open = true, children, onClick, onBgdClick, selectedIdx, cardWidth }: Props) {
  return (
    <CardContainerWrapper defaultOpen={open} 
      title={<ContainerHeader label={label} count={cards?.length} lands={lands} />}
      isPrimary={selectedIdx == null} onClick={onBgdClick}
    >
      {children}

      <CardsWrapper>
        {cards ?
          cards.map(({ id, card }, idx) => 
            <CardDisplay
              card={card} key={id} className={cardWidth}
              onClick={onClick && ((ev) => onClick(id, idx, ev))}
              isSelected={selectedIdx === idx}
            />
          ) :
          <NoCards />
        }
      </CardsWrapper>

    </CardContainerWrapper>
  )
}