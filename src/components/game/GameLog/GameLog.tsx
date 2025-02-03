import type { Dispatch, SetStateAction } from "react"
import type { BasicPlayer } from "types/game"
import type { GameLog } from "./log.controller"
import { useState } from "react"
import LogToolbar from "./LogToolbar/LogToolbar"
import LogEntry from "./LogEntry"
import { LogContainer, ErrorContainer, CardModal } from "./LogStyles"

export type Props = {
  players: BasicPlayer[],
  log: GameLog,
  gameEnded: boolean,
  logout?: () => void,
  sidebarVisible?: boolean,
  setSidebar?: Dispatch<SetStateAction<boolean>>,
}

export default function GameLog({ log, players, gameEnded, logout, sidebarVisible, setSidebar }: Props) {
  const [cardImg, setCardImg] = useState<string|null>(null)

  return log.error ? <ErrorContainer text={log.error} /> : 

    <LogContainer toolbar={
      <LogToolbar
        log={log} players={players} gameEnded={gameEnded} logout={logout}
        sidebarVisible={sidebarVisible} setSidebar={setSidebar}
      />
    }>
      {log.size == null ? "Loading..." :
        Array.from({ length: log.size }).map((_, idx) => (
          <LogEntry
            index={(log.size as number) - idx - 1}
            log={log}
            players={players}
            setCardImg={setCardImg}
            key={log.list[(log.size as number) - idx - 1]?.id ?? idx}
          />
        ))
      }
      <CardModal src={cardImg} alt="Popout Card Image" close={() => setCardImg(null)} />
    </LogContainer>
}
