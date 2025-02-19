import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import { CardFull, CardOptions, BoardLands, TabLabels, BasicPlayer, GameCardFull } from "types/game"
import Card from "../Card/Card"
import ContainerHeader from "./CardContainerHeader"
import { CardContainerWrapper, CardsWrapper, NoPack, NoCards, RoundOver, LoadingPack, PausedGame } from "./CardContainerStyles"
import { packSort, sortKeys } from "components/base/services/cardSort.services"

type Props = {
  label: TabLabels | "select",
  cards?: Pick<GameCardFull, "id"|"foil"|"card"|"playerId">[] | "roundEnd",
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
  overrideBody?: ReactNode,
  players?: BasicPlayer[],
}

export default function CardContainer({ label, cards, lands, loading = 0, paused, children, onClick, onCardLoad, onBgdClick, onLandClick, selectedId, highlightId, cardOptions, overrideBody, players }: Props) {
  const count = typeof cards === 'string' ? undefined : cards?.length
  const player = players && count && (label === TabLabels.main || label === TabLabels.side) ? players?.find(({ id }) => id === (cards as GameCardFull[])[0].playerId) : undefined
  
  return (
    <CardContainerWrapper 
      title={
        <ContainerHeader label={label} subtitle={player && `${player.name} – `} count={count} lands={lands} onLandClick={onLandClick}>
          {children}
        </ContainerHeader>
      }
      isPrimary={label !== TabLabels.pack && label !== 'select'} onClick={onBgdClick}
    >
      { paused && <PausedGame /> }
      <CardsWrapper hideCards={loading > 0}>
        {overrideBody ? overrideBody : loading < 0 ? null : typeof cards === 'string' ? <RoundOver /> : !cards ? <NoPack /> : !count ? <NoCards /> :
          cards.toSorted((a,b) => packSort[cardOptions.sort ?? sortKeys[0]](a.card, b.card)).map(({ id, foil, card, playerId }) => 
            <Card
              card={card} key={id} isFoil={foil}
              showImage={cardOptions.showArt}
              className={paused ? "hidden" : "w-card h-card text-card"}
              onClick={onClick && ((ev) => onClick(id, ev))}
              onLoad={onCardLoad}
              isSelected={selectedId === id}
              isHighlighted={!selectedId && highlightId === id}
              container={label === 'select' ? TabLabels.pack : label}
              player={player || players?.find(({ id }) => id === playerId)}
            />
          )
        }
      </CardsWrapper>

      { !!loading && <LoadingPack loading={loading} count={cards?.length} /> }
    </CardContainerWrapper>
  )
}