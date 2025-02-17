import type { BasicPlayer, PackFull } from "types/game"
import { useCardPopout, type GameLog } from "./log.controller"
import { type Dispatch, type SetStateAction } from "react"
import LogToolbar from "./LogToolbar/LogToolbar"
import LogEntry from "./LogEntry"
import { LogContainer, ErrorContainer, CardModal } from "./LogStyles"
import { ArtSize } from "../CardToolbar/CardToolbarStyles"
import cardZoomLevels from "../CardToolbar/cardZoomLevels"

export type Props = {
  log: GameLog,
  players: BasicPlayer[],
  packs?: PackFull[],
  gameEnded: boolean,
  logout?: () => void,
  sidebarVisible?: boolean,
  setSidebar?: Dispatch<SetStateAction<boolean>>,
}


export default function GameLog({ log, players, packs, gameEnded, logout, sidebarVisible, setSidebar }: Props) {
  const { card, setCard, zoom, setZoom, width } = useCardPopout(packs)
  
  return log.error ? <ErrorContainer text={log.error} /> : 

    <LogContainer ref={log.scrollParentRef} toolbar={
      <LogToolbar
        log={log} players={players} gameEnded={gameEnded} logout={logout}
        sidebarVisible={sidebarVisible} setSidebar={setSidebar}
      />
    }>
      {log.entries == null ? "Loading..." :
        !log.entries.length ? "No entries yet" :
        log.entries.map((entry) => entry && (
          <LogEntry key={entry.index} {...entry}  isPrivate={log.options.hidePrivate} players={players} setCard={setCard} />
        ))
      }

      <CardModal card={card} close={() => setCard(undefined)} className={width}>
        <ArtSize aria-label="Card zoom" value={zoom} setValue={setZoom} min={0} max={cardZoomLevels.length - 1} />
      </CardModal>
    </LogContainer>
}
