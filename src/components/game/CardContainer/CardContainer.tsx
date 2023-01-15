import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import type { TabLabels } from "@prisma/client"
import type { CardFull, CardOptions, BoardLands } from "types/game"
import Card from "../Card/Card"
import ContainerHeader from "./CardContainerHeader"
import { CardContainerWrapper, CardsWrapper, NoPack, EmptyPack, EmptyBoard, LoadingPack } from "./CardContainerStyles"
import { packSort, sortKeys } from "components/base/services/cardSort.services"
import cardZoomLevels from "../CardToolbar/cardZoomLevels"

type Props = {
  label: TabLabels,
  cards?: { id: string, foil?: boolean, card: CardFull }[],
  lands?: BoardLands,
  loading?: boolean,
  children?: ReactNode,
  onClick?: (id: string, event: MouseEvent) => void,
  onBgdClick?: MouseEventHandler,
  onLandClick?: MouseEventHandler,
  selectedId?: string,
  highlightId?: string,
  cardOptions: CardOptions,
}

export default function CardContainer({ label, cards, lands, loading, children, onClick, onBgdClick, onLandClick, selectedId, highlightId, cardOptions }: Props) {
  return (
    <CardContainerWrapper 
      title={<ContainerHeader label={label} count={cards?.length} lands={lands} onLandClick={onLandClick}>{children}</ContainerHeader>}
      isPrimary={label !== 'pack'} onClick={onBgdClick}
    >
      <CardsWrapper>
        {loading ? <LoadingPack /> : !cards ? <NoPack /> : !cards.length ? (label === 'pack' ? <EmptyPack /> : <EmptyBoard />) :
          cards.slice().sort((a,b) => packSort[cardOptions.sort ?? sortKeys[0]](a.card, b.card)).map(({ id, foil, card }, idx) => 
            <Card
              card={card} key={id} isFoil={foil}
              showImage={cardOptions.showArt}
              className={cardOptions.width || cardZoomLevels[0]}
              onClick={onClick && ((ev) => onClick(id, ev))}
              isSelected={selectedId === id}
              isHighlighted={!selectedId && highlightId === id}
              container={label}
            />
          )
        }
      </CardsWrapper>

    </CardContainerWrapper>
  )
}