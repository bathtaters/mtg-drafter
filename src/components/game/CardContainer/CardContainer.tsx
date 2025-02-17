import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import type { CardFull, CardOptions, BoardLands, TabLabels } from "types/game"
import Card from "../Card/Card"
import ContainerHeader from "./CardContainerHeader"
import { CardContainerWrapper, CardsWrapper, NoPack, NoCards, RoundOver, LoadingPack, PausedGame } from "./CardContainerStyles"
import { packSort, sortKeys } from "components/base/services/cardSort.services"

type Props = {
  label: TabLabels,
  cards?: { id: string, foil?: boolean, card: CardFull }[] | "roundEnd",
  lands?: BoardLands,
  loading?: number,
  paused?: boolean,
  children?: ReactNode,
  onCardLoad?: () => void,
  onClick?: (id: string, event: MouseEvent) => void,
  onBgdClick?: MouseEventHandler,
  onLandClick?: MouseEventHandler,
  selectedId?: string,
  highlightId?: string,
  cardOptions: CardOptions,
}

export default function CardContainer({ label, cards, lands, loading = 0, paused, children, onClick, onCardLoad, onBgdClick, onLandClick, selectedId, highlightId, cardOptions }: Props) {
  const count = typeof cards === 'string' ? undefined : cards?.length
  
  return (
    <CardContainerWrapper 
      title={
        <ContainerHeader label={label} count={count} lands={lands} onLandClick={onLandClick}>
          {children}
        </ContainerHeader>
      }
      isPrimary={label !== 'pack'} onClick={onBgdClick}
    >
      { paused && <PausedGame /> }
      <CardsWrapper hideCards={loading > 0}>
        {loading < 0 ? null : typeof cards === 'string' ? <RoundOver /> : !cards ? <NoPack /> : !count ? <NoCards /> :
          cards.toSorted((a,b) => packSort[cardOptions.sort ?? sortKeys[0]](a.card, b.card)).map(({ id, foil, card }, idx) => 
            <Card
              card={card} key={id} isFoil={foil}
              showImage={cardOptions.showArt}
              className={paused ? "hidden" : "w-card h-card text-card"}
              onClick={onClick && ((ev) => onClick(id, ev))}
              onLoad={onCardLoad}
              isSelected={selectedId === id}
              isHighlighted={!selectedId && highlightId === id}
              container={label}
            />
          )
        }
      </CardsWrapper>

      { !!loading && <LoadingPack loading={loading} count={cards?.length} /> }
    </CardContainerWrapper>
  )
}