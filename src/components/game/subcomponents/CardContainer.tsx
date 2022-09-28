import { ReactNode, MouseEvent } from "react"
import CardDisplay from "./CardDisplay"
import { CardContainerWrapper, CardsWrapper, NoCards, NoCardsPip } from "../styles/GameCardStyles"


export default function CardContainer({ label, cards, open = true, children, onClick, selectedIdx }: {
  label: ReactNode,
  cards?: string[],
  open?: boolean,
  children?: ReactNode,
  onClick?: (idx: number, event: MouseEvent) => void,
  selectedIdx?: number,
}) {
  return (
    <CardContainerWrapper defaultOpen={open} 
      title={<>{!cards && <NoCardsPip />}{label}</>}
    >
      {children}

      <CardsWrapper>
        {cards ?
          cards.map((card, idx) => 
            <CardDisplay
              card={card} key={card}
              onClick={onClick && ((ev) => onClick(idx, ev))}
              isSelected={selectedIdx === idx}
            />
          ) :
          <NoCards />
        }
      </CardsWrapper>

    </CardContainerWrapper>
  )
}