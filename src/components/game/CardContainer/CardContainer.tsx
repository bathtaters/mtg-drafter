import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import type { CardFull, CardOptions, BoardLands } from "types/game"
import CardDisplay, { ContainerType } from "../CardDisplay/CardDisplay"
import ContainerHeader from "./CardContainerHeader"
import { CardContainerWrapper, CardsWrapper, NoCards, NoPacks } from "./CardContainerStyles"
import { packSort, sortKeys } from "components/base/services/cardSort.services"

type Props = {
  label: ContainerType,
  cards?: { id: string, card: CardFull }[],
  lands?: BoardLands,
  open?: boolean,
  children?: ReactNode,
  onClick?: (id: string, idx: number, event: MouseEvent) => void,
  onBgdClick?: MouseEventHandler,
  onLandClick?: MouseEventHandler,
  selectedIdx?: number,
  cardOptions: CardOptions,
}

export default function CardContainer({ label, cards, lands, open = true, children, onClick, onBgdClick, onLandClick, selectedIdx, cardOptions }: Props) {
  return (
    <CardContainerWrapper defaultOpen={open} 
      title={<ContainerHeader label={label} count={cards?.length} lands={lands} onLandClick={onLandClick} />}
      isPrimary={selectedIdx == null} onClick={onBgdClick}
    >
      {children}

      <CardsWrapper>
        {!cards ? <NoCards /> : !cards.length ? <NoPacks /> :
          cards.sort((a,b) => packSort[cardOptions.sort ?? sortKeys[0]](a.card, b.card)).map(({ id, card }, idx) => 
            <CardDisplay
              card={card} key={id}
              showImage={cardOptions.showArt}
              className={cardOptions.width}
              onClick={onClick && ((ev) => onClick(id, idx, ev))}
              isSelected={selectedIdx === idx}
              container={label}
            />
          )
        }
      </CardsWrapper>

    </CardContainerWrapper>
  )
}