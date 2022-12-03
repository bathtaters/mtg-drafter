import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import type { CardFull, CardOptions, BoardLands, TabLabels } from "types/game"
import Card from "../Card/Card"
import ContainerHeader from "./CardContainerHeader"
import { CardContainerWrapper, CardsWrapper, NoPack, EmptyPack, EmptyBoard, LoadingPack } from "./CardContainerStyles"
import { packSort, sortKeys } from "components/base/services/cardSort.services"

type Props = {
  label: TabLabels,
  cards?: { id: string, card: CardFull }[],
  lands?: BoardLands,
  loading?: boolean,
  children?: ReactNode,
  onClick?: (id: string, event: MouseEvent) => void,
  onBgdClick?: MouseEventHandler,
  onLandClick?: MouseEventHandler,
  selectedId?: string,
  cardOptions: CardOptions,
}

export default function CardContainer({ label, cards, lands, loading, children, onClick, onBgdClick, onLandClick, selectedId, cardOptions }: Props) {
  return (
    <CardContainerWrapper 
      title={<ContainerHeader label={label} count={cards?.length} lands={lands} onLandClick={onLandClick}>{children}</ContainerHeader>}
      isPrimary={label !== 'pack'} onClick={onBgdClick}
    >
      <CardsWrapper>
        {loading ? <LoadingPack /> : !cards ? <NoPack /> : !cards.length ? (label === 'pack' ? <EmptyPack /> : <EmptyBoard />) :
          cards.sort((a,b) => packSort[cardOptions.sort ?? sortKeys[0]](a.card, b.card)).map(({ id, card }, idx) => 
            <Card
              card={card} key={id}
              showImage={cardOptions.showArt}
              className={cardOptions.width}
              onClick={onClick && ((ev) => onClick(id, ev))}
              isSelected={selectedId === id}
              container={label}
            />
          )
        }
      </CardsWrapper>

    </CardContainerWrapper>
  )
}