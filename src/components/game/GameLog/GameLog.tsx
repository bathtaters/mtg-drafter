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
  const firstIndex = useMemo(() => Math.max(...Object.keys(log.list)), [log.list])
  const [cardImg, setCardImg] = useState<string|null>(null)

  const { parentRef, childProps } = useIntersection(
    (index) => log.fetchOffset(index),
    { threshold: 1, rootMargin: '490px 0px 490px 0px' },
    [log.size, log.fetchOffset],
  )
  
  return log.error ? <ErrorContainer text={log.error} /> : 

    <LogContainer ref={parentRef} toolbar={
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
            getChildProps={childProps}
            firstIndex={firstIndex}
            key={(log.size as number) - idx - 1}
          />
        ))
      }
      <CardModal src={cardImg} alt="Popout Card Image" close={() => setCardImg(null)} />
    </LogContainer>
}
