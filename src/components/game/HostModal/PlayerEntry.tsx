import type { BasicPlayer, Socket } from "types/game"
import { PlayerWrapper, NameEditor, DropButton } from "./HostModalStyles"
import { BOT, setupLimits } from "assets/constants"

type Props = {
  player: BasicPlayer,
  isHost: boolean,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
}

export default function PlayerEntry({ player, isHost, renamePlayer, setStatus }: Props) {
  const { label, action } = getButtonData(player.id, player.sessionId, isHost, setStatus)

  return (
    <PlayerWrapper>
      <NameEditor value={player.name || ''} onSubmit={(name) => renamePlayer(name, player.id, true)} btnLeft={true} {...setupLimits.name} />
      <DropButton onClick={action} label={label} />
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
    label: sessionId === BOT ? 'Open' : 'Drop',
    action: () => setStatus(id, 'leave', true),
  }
}