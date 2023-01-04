import type { Game, Player } from "@prisma/client"
import type { Socket } from "types/game"
import ModalWrapper, { ModalButton } from "components/base/common/Modal"
import Loader from "components/base/Loader"
import PlayerEntry from "./PlayerEntry"
import { Divider, FieldWrapper, TitleEditor, PlayersContainer } from "./HostModalStyles"

type Props = {
  isOpen: boolean,
  setOpen: () => void,
  setLog?: () => void,
  title?: Game['name'],
  players: Player[],
  hostId: Game['hostId'],
  setTitle: Socket.SetTitle,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
}


export default function HostModal({ isOpen, setOpen, setLog, title, setTitle, players, renamePlayer, hostId, setStatus }: Props) {
  return (
    <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      title="Host Tools"
      buttons={<>
        { setLog && <ModalButton onClick={setLog}>View Log</ModalButton> }
        <ModalButton onClick={setOpen}>Close</ModalButton>
      </>}
    >
      <Loader data={title}>

        <FieldWrapper label="Rename Game">
          <TitleEditor value={title as string} onSubmit={setTitle} />
        </FieldWrapper>

        <Divider />

        <PlayersContainer label="Edit Players">
          {players.map((player) => 
            <PlayerEntry key={player.id}
              player={player} isHost={player.id === hostId}
              renamePlayer={renamePlayer} setStatus={setStatus}
            />
          )}
        </PlayersContainer>
      </Loader>
    </ModalWrapper>
  )
}