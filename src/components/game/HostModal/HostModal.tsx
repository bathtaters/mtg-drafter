import type { Game, BasicPlayer, Socket, PartialGame } from "types/game"
import ModalWrapper, { ModalButton } from "components/base/common/Modal"
import Loader from "components/base/Loader"
import PlayerEntry from "./PlayerEntry"
import CopyLink from "components/base/common/CopyLink"
import PasswordForm from "components/base/common/FormElements/PasswordForm"
import { Divider, GameContainer, TitleEditor, PlayersContainer, PauseButton, WatchContainer, HostTimerInput } from "./HostModalStyles"
import useHostController from "./host.controller"
import { setupLimits, shareWatch } from "assets/constants"
import { AlertsReturn } from "components/base/common/Alerts/alerts.hook"


type Props = {
  isOpen: boolean,
  setOpen: () => void,
  setLog?: () => void,
  game?: Game | PartialGame,
  players: BasicPlayer[],
  setOptions: Socket.SetOptions,
  pauseGame: Socket.PauseGame,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
  setWatchPw: Socket.SetWatchPw,
  notify: AlertsReturn['newToast'],
}


export default function HostModal({
  isOpen, setOpen, setLog,
  game, setOptions, pauseGame,
  players, renamePlayer, setStatus,
  setWatchPw, notify
}: Props) {
  const { paused, title, setTitle, timer, updateTimer } = useHostController(game, setOptions)

  return (
    <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      title="Host Tools"
      buttons={<>
        { setLog && <ModalButton onClick={setLog}>View Log</ModalButton> }
        <ModalButton onClick={setOpen}>Close</ModalButton>
      </>}
    >
      <Loader data={game}>

        <GameContainer label="Edit Game">
            <TitleEditor value={title} onSubmit={setTitle} {...setupLimits.name} />
          
            <PauseButton label={paused ? "Resume Game" : "Pause Game"} value={paused} setValue={(val) => pauseGame(val)} />
        </GameContainer>

        {game && 'timerBase' in game &&
          <HostTimerInput value={timer} setValue={updateTimer} {...setupLimits.timer} />
        }

        <Divider />

        <PlayersContainer label="Edit Players">
          {players.map((player) => 
            <PlayerEntry key={player.id}
              player={player} isHost={player.id === (game as Game)?.hostId}
              renamePlayer={renamePlayer} setStatus={setStatus}
            />
          )}
        </PlayersContainer>

        <Divider />

        <WatchContainer>
          <CopyLink {...shareWatch} url={game?.watchKey ? shareWatch.url(game?.url) : undefined} notify={notify} />
          <PasswordForm label="Live Watch Password" btnLabel="Set" emptyBtn="Clear" placeholder={game?.watchKey ? "••••••••" : ""} onSubmit={setWatchPw} isCreate={true} />
        </WatchContainer>
      </Loader>
    </ModalWrapper>
  )
}