import type { BasicPlayer, GameCardFull, GameCardPartial, PackFull } from "types/game"
import type { GameLog } from "./log.controller"
import { type Dispatch, type SetStateAction, useState } from "react"
import LogToolbar from "./LogToolbar/LogToolbar"
import LogEntry from "./LogEntry"
import { LogContainer, ErrorContainer, CardModal } from "./LogStyles"

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
  const [card, showCard] = useState<GameCardFull | GameCardPartial>()
  const setCard = (card?: GameCardPartial) => showCard(card ? packs?.[card.packIdx].cards.find(({ id }) => id === card.id) ?? card : card)
  
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
      <CardModal card={card} alt="Popout Card Image" close={() => showCard(undefined)} />
    </LogContainer>
}
