import type { BasicPlayer, PackFull } from "types/game"
import { useIntersection } from "components/base/libs/hooks"
import { useCardPopout, type GameLog } from "./log.controller"
import LogEntry from "./LogEntry"
import { LogContainer, ErrorContainer, CardModal, EntryWrapper } from "./LogStyles"
import { ArtSize } from "../CardToolbar/CardToolbarStyles"
import cardZoomLevels from "../CardToolbar/cardZoomLevels"
import { dynamicScrollOptions } from "assets/constants"

export type Props = {
  gameLog: GameLog,
  players: BasicPlayer[],
  packs?: PackFull[],
}


export default function GameLog({ gameLog, players, packs }: Props) {
  const { card, setCard, zoom, setZoom, width } = useCardPopout(packs)
  const intersectionRef = useIntersection(gameLog.intersectFetch, dynamicScrollOptions)
  
  return gameLog.error ? <ErrorContainer text={gameLog.error} /> : 

    <LogContainer ref={intersectionRef}>
      {gameLog.entries == null ? "Loading..." :
        !gameLog.entries.length ? "No entries yet" :
        gameLog.entries.map((entry) => entry && (
          <EntryWrapper key={entry.entry?.id ?? entry.index} index={entry.index} hidden={entry.isFiltered}>
            <LogEntry 
              {...entry}
              isPrivate={gameLog.options.hidePrivate}
              players={players}
              setCard={setCard}
            />
          </EntryWrapper>
        ))
      }

      <CardModal card={card} close={() => setCard(undefined)} className={width}>
        <ArtSize aria-label="Card zoom" value={zoom} setValue={setZoom} min={0} max={cardZoomLevels.length - 1} />
      </CardModal>
    </LogContainer>
}
