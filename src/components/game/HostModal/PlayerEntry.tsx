import type { BasicPlayer, Socket } from "types/game"
import { PlayerWrapper, NameEditor, DropButton, PlayerButton } from "./HostModalStyles"
import { BOT, setupLimits } from "assets/constants"
import HostIcon from "components/svgs/HostIcon"
import BotIcon from "components/svgs/BotIcon"

type Props = {
  player: BasicPlayer,
  isHost: boolean,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
  setHost: (hostId: string) => void,
}

export default function PlayerEntry({ player, isHost, renamePlayer, setStatus, setHost }: Props) {
  const { label, action } = getButtonData(player.id, player.sessionId, isHost, setStatus)

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

function getButtonData(id: string, sessionId: string | null, isHost: boolean, setStatus: Socket.SetStatus) {
  if (isHost) return { label: 'Host' }
  if (!sessionId) return {
    label: 'Bot',
    action: () => setStatus(id, 'bot', true),
  }
  return {
    label: sessionId === BOT ? 'Kill' : 'Drop',
    action: () => setStatus(id, 'leave', true),
  }
}