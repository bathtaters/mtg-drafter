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
}

export default function GameLog({ log, players, gameEnded, logout }: Props) {
  const [cardImg, setCardImg] = useState<string|null>(null)

  return log.error ? <ErrorContainer text={log.error} /> : 

    <LogContainer toolbar={<LogToolbar log={log} players={players} gameEnded={gameEnded} logout={logout} />}>
      {!log.list ? "Loading..." : log.list.map((entry, idx) =>
        <LogEntry
          key={entry.id}
          entry={entry}
          players={players}
          isFirst={!idx}
          isPrivate={log.options.hidePrivate}
          setCardImg={setCardImg}
        />
      )}
      <CardModal src={cardImg} alt="Popout Card Image" close={() => setCardImg(null)} />
    </LogContainer>
}