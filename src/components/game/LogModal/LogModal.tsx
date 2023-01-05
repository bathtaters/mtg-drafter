import type { Dispatch, SetStateAction } from "react"
import type { Player } from "@prisma/client"
import type { GameLog } from "./log.controller"
import LogToolbar from "./LogToolbar/LogToolbar"
import LogEntry from "./LogEntry"
import { LargeModal, LogContainer, ErrorContainer } from "./LogModalStyles"

type Props = {
  players: Player[],
  log: GameLog,
  gameEnded: boolean,
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export default function LogModal({ log, players, gameEnded, isOpen, setOpen }: Props) {
  return (
    <LargeModal isOpen={isOpen} setOpen={setOpen} title="Game Log">

      { log.error ? <ErrorContainer text={log.error} /> : 

        <LogContainer toolbar={<LogToolbar log={log} players={players} gameEnded={gameEnded} />}>

          {!log.list ? "Loading..." : log.list.map((entry, idx) =>
            <LogEntry key={entry.id} entry={entry} players={players} isFirst={!idx} isPrivate={log.options.hidePrivate} />
          )}

        </LogContainer>
      }
    </LargeModal>
  )
}