import type { Game, BasicPlayer, Socket } from "types/game"
import ModalWrapper, { ModalButton } from "components/base/common/Modal"
import Loader from "components/base/Loader"
import PlayerEntry from "./PlayerEntry"
import CopyLink from "components/base/common/CopyLink"
import PasswordForm from "components/base/common/FormElements/PasswordForm"
import { Divider, GameContainer, TitleEditor, PlayersContainer, PauseButton, WatchContainer } from "./HostModalStyles"
import { setupLimits, shareWatch } from "assets/constants"
import { AlertsReturn } from "components/base/common/Alerts/alerts.hook"


type Props = {
  isOpen: boolean,
  setOpen: () => void,
  setLog?: () => void,
  title?: Game['name'],
  paused: boolean,
  players: BasicPlayer[],
  hostId: Game['hostId'],
  watchUrl?: string | null,
  setTitle: Socket.SetTitle,
  pauseGame: Socket.PauseGame,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
  notify: AlertsReturn['newToast'],
}


export default function HostModal({
  isOpen, setOpen, setLog,
  title, setTitle,
  paused, pauseGame,
  players, renamePlayer,
  hostId, setStatus,
  watchUrl, notify
}: Props) {

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

        <Divider />

        <WatchContainer>
          <CopyLink {...shareWatch} url={watchUrl ? shareWatch.url(watchUrl) : undefined} notify={notify} />
          <PasswordForm label="Live Watch Password" btnLabel="Set" emptyBtn="Clear" placeholder={watchUrl ? "••••••••" : ""} onSubmit={setWatchPw} />
        </WatchContainer>
      </Loader>
    </ModalWrapper>
  )
}