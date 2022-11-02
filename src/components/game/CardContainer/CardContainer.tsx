import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import type { CardFull, CardOptions, BoardLands } from "types/game"
import CardDisplay from "../CardDisplay/CardDisplay"
import ContainerHeader from "./CardContainerHeader"
import { CardContainerWrapper, CardsWrapper, NoCards } from "./CardContainerStyles"
import { packSort, sortKeys } from "components/base/services/cardSort.services"

type Props = {
  label: ReactNode,
  cards?: { id: string, card: CardFull }[],
  lands?: BoardLands,
  open?: boolean,
  children?: ReactNode,
  onClick?: (id: string, idx: number, event: MouseEvent) => void,
  onBgdClick?: MouseEventHandler,
  selectedIdx?: number,
  cardOptions: CardOptions,
}

export default function CardContainer({ label, cards, lands, open = true, children, onClick, onBgdClick, selectedIdx, cardOptions }: Props) {
  return (
    <CardContainerWrapper defaultOpen={open} 
      title={<ContainerHeader label={label} count={cards?.length} lands={lands} />}
      isPrimary={selectedIdx == null} onClick={onBgdClick}
    >
      {children}

      <CardsWrapper>
        {cards ?
          cards.sort((a,b) => packSort[cardOptions.sort ?? sortKeys[0]](a.card, b.card)).map(({ id, card }, idx) => 
            <CardDisplay
              card={card} key={id}
              showImage={cardOptions.showArt}
              className={cardOptions.width}
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