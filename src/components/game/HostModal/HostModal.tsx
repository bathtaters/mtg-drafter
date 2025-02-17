import type { Game, BasicPlayer, Socket, PartialGame } from "types/game"
import { PlayerStatus } from "types/game"
import ModalWrapper, { ModalButton } from "components/base/common/Modal"
import Loader from "components/base/Loader"
import Moderation from "./HostModeration"
import PlayerEntry from "./PlayerEntry"
import PasswordForm from "components/base/common/FormElements/PasswordForm"
import { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import {
  TitlePauseContainer, TitleEditor,
  PauseButton, HostTimerInput,
  Collapser, PlayersWrapper, LockButton,
  linkClass, WatchersContainer,
} from "./HostModalStyles"
import useHostController from "./host.controller"
import { setupLimits } from "assets/constants"
import CopyLink from "components/base/common/CopyLink"


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
  dropWatcher: Socket.DropWatcher,
  banSession: Socket.BanSession,
  notify: AlertsReturn['newToast'],
}


export default function HostModal({
  isOpen, setOpen, setLog,
  game, setOptions, pauseGame,
  players, renamePlayer, setStatus,
  setWatchPw, dropWatcher, banSession, notify
}: Props) {

  const {
    expanded, toggleExpand, timer, updateTimer,
    banned, banPlayer, watchers, locked, lockGame,
    title, setTitle, setHost, paused, copyProps
  } = useHostController(game, setOptions, banSession)

  return (
    <ModalWrapper isOpen={isOpen} setOpen={setOpen}
      title="Host Tools"
      buttons={<>
        { setLog && <ModalButton onClick={setLog}>View Log</ModalButton> }
        <ModalButton onClick={setOpen}>Close</ModalButton>
      </>}
    >
      <Loader data={game}>

        {/* GAME */}
        <Collapser label="Game" isOpen={expanded === 1} toggle={toggleExpand(1)}>
          <TitlePauseContainer>
            <TitleEditor value={title} onSubmit={setTitle} {...setupLimits.name} />
          
            <PauseButton label={paused ? "Resume Game" : "Pause Game"} value={paused} setValue={(val) => pauseGame(val)} />
          </TitlePauseContainer>

          {game && 'timerBase' in game &&
            <HostTimerInput value={timer} setValue={updateTimer} {...setupLimits.timer} />
          }
        </Collapser>


        {/* PLAYERS */}
        <Collapser label="Players" isOpen={expanded === 2} toggle={toggleExpand(2)}>
          <PlayersWrapper>
            {players.map((player) => 
              <PlayerEntry key={player.id}
                player={player} isHost={player.sessionId === (game as Game)?.hostId}
                renamePlayer={renamePlayer} setStatus={setStatus} setHost={setHost}
              />
            )}
          </PlayersWrapper>
          
          <Moderation label="Moderation Controls" players={players} banned={banned} banOne={banPlayer} 
            kickOne={(playerId) => setStatus(playerId, PlayerStatus.leave, true)}>
            <LockButton locked={locked} onClick={() => lockGame(locked)} />
          </Moderation>
        </Collapser>

        
        {/* WATCHERS */}
        <Collapser label="Watchers" isOpen={expanded === 3} toggle={toggleExpand(3)}>

          <PasswordForm
            label="Watch Password" disabled={!game?.watchKey}
            btnLabel="Set" emptyBtn={game?.watchKey ? "Disable" : "Disabled"}
            placeholder={game?.watchKey ? "••••••••" : ""}
            onSubmit={setWatchPw} isCreate={true}
            heightClass="h-8"
          />
            
          <Moderation label="Active Watchers" players={watchers} kickOne={dropWatcher} banOne={banPlayer} />
          
          <WatchersContainer label="More Actions">
            <CopyLink className={linkClass} {...copyProps} notify={notify} tooltip="">Copy Watch Link</CopyLink>
            <a className={linkClass} onClick={toggleExpand(2)}>View Ban List</a>
          </WatchersContainer>
        </Collapser>

      </Loader>
    </ModalWrapper>
  )
}
