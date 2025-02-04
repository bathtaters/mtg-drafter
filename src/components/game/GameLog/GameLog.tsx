import type { BasicPlayer } from "types/game"
import type { GameLog } from "./log.controller"
import { type Dispatch, type SetStateAction, useMemo, useState } from "react"
import LogToolbar from "./LogToolbar/LogToolbar"
import LogEntry from "./LogEntry"
import { LogContainer, ErrorContainer, CardModal } from "./LogStyles"
import { useIntersection } from "components/base/libs/hooks"

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
  const total = log.total ?? 0

  const { parentRef, childProps } = useIntersection(
    (index) => log.fetchOffset(index),
    { threshold: 1, rootMargin: '490px 0px 490px 0px' },
    [log.total, log.loaded, log.fetchOffset],
  )
  
  return log.error ? <ErrorContainer text={log.error} /> : 

    <LogContainer ref={parentRef} toolbar={
      <LogToolbar
        log={log} players={players} gameEnded={gameEnded} logout={logout}
        sidebarVisible={sidebarVisible} setSidebar={setSidebar}
      />
    }>
      {log.total == null ? "Loading..." :
        Array.from({ length: total }).map((_, idx) => (
          <LogEntry
            index={total - idx - 1}
            log={log}
            players={players}
            preview={log.preview?.[idx - log.loaded.next + log.loaded.count]}
            setCardImg={setCardImg}
            getChildProps={childProps}
            key={total - idx - 1}
          />
        ))
      }
      <CardModal src={cardImg} alt="Popout Card Image" close={() => setCardImg(null)} />
    </LogContainer>
}
