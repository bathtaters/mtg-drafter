import type { ReactNode, MouseEvent, MouseEventHandler } from "react"
import { CardOptions, BoardLands, TabLabels, GameCardFull, PickInfo } from "types/game"
import Card from "../Card/Card"
import ContainerHeader from "./CardContainerHeader"
import { CardContainerWrapper, CardsWrapper, NoPack, NoCards, RoundOver, LoadingPack, PausedGame, NotLive } from "./CardContainerStyles"
import { packSort, sortKeys } from "components/base/services/cardSort.services"

type Props = {
  type: TabLabels | "select",
  round?: number,
  name?: string | null,
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
  pickInfo?: PickInfo,
}


export default function CardContainer({ type, round, name, cards, lands, loading = 0, paused, children, onClick, onCardLoad, onBgdClick, onLandClick, selectedId, highlightId, cardOptions, overrideBody, pickInfo }: Props) {
  const count = typeof cards === 'string' ? undefined : cards?.length
  
  return (
    <CardContainerWrapper 
      title={
        <ContainerHeader
          label={type} count={count} lands={lands} onLandClick={onLandClick}
          prefix={name && `${name} – `}
          suffix={type === TabLabels.pack && round && ` ${round}`}
        >
          {children}
        </ContainerHeader>
      }
      isPrimary={type !== TabLabels.pack && type !== 'select'} onClick={onBgdClick}
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
              container={type === 'select' ? TabLabels.pack : type}
              pickInfo={pickInfo ? pickInfo[id] ?? {} : undefined}
            />
          )
        }
      </CardsWrapper>
      { name && (type === TabLabels.main || type === TabLabels.side) && <NotLive /> }

      { !!loading && <LoadingPack loading={loading} count={cards?.length} /> }
    </CardContainerWrapper>
  )
}