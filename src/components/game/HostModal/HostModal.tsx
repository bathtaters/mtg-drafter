import type { Game, BasicPlayer, Socket } from "types/game"
import ModalWrapper, { ModalButton } from "components/base/common/Modal"
import Loader from "components/base/Loader"
import PlayerEntry from "./PlayerEntry"
import { Divider, GameContainer, TitleEditor, PlayersContainer, PauseButton } from "./HostModalStyles"
import { setupLimits } from "assets/constants"


type Props = {
  isOpen: boolean,
  setOpen: () => void,
  setLog?: () => void,
  title?: Game['name'],
  paused: boolean,
  players: BasicPlayer[],
  hostId: Game['hostId'],
  setTitle: Socket.SetTitle,
  pauseGame: Socket.PauseGame,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
}


export default function HostModal({ isOpen, setOpen, setLog, title, setTitle, paused, pauseGame, players, renamePlayer, hostId, setStatus }: Props) {
  return (
    <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      title="Host Tools"
      buttons={<>
        { setLog && <ModalButton onClick={setLog}>View Log</ModalButton> }
        <ModalButton onClick={setOpen}>Close</ModalButton>
      </>}
    >
      <Loader data={title}>

        <GameContainer label="Edit Game">
            <TitleEditor value={title as string} onSubmit={setTitle} {...setupLimits.name} />
          
            <PauseButton label={paused ? "Resume Game" : "Pause Game"} value={paused} setValue={(val) => pauseGame(val)} />
        </GameContainer>

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