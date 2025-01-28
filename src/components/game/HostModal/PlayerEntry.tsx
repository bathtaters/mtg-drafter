import type { BasicPlayer, Socket } from "types/game"
import { PlayerWrapper, NameEditor, DropButton, PlayerButton } from "./HostModalStyles"
import { getPlayerButtonData } from "./host.controller"
import HostIcon from "components/svgs/HostIcon"
import BotIcon from "components/svgs/BotIcon"
import { BOT, setupLimits } from "assets/constants"

type Props = {
  player: BasicPlayer,
  isHost: boolean,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
  setHost: (hostId: string) => void,
}

export default function PlayerEntry({ player, isHost, renamePlayer, setStatus, setHost }: Props) {
  const { label, action } = getPlayerButtonData(player.id, player.sessionId, isHost, setStatus)

  return (
    <PlayerWrapper>
      {!player.sessionId ? null : player.sessionId === BOT ?
        <PlayerButton label={<BotIcon className="h-6" />} /> :
        <PlayerButton label={<HostIcon />} tooltip="Set Host" onClick={!isHost && (() => setHost(player.id))} />
      }

      <NameEditor
        value={player.name || ''}
        onSubmit={(name) => renamePlayer(name, player.id, true)}
        btnLeft={true} {...setupLimits.name}
        wrapperClass={player.sessionId ? 'border-l-0' : 'rounded-l-lg'}
      />

      <DropButton label={label} onClick={action} />
    </PlayerWrapper>
  )
}
