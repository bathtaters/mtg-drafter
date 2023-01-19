import type { BasicPlayer, Socket } from "types/game"
import { PlayerWrapper, NameEditor, DropButton } from "./HostModalStyles"
import { setupLimits } from "assets/constants"

type Props = {
  player: BasicPlayer,
  isHost: boolean,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
}

export default function PlayerEntry({ player, isHost, renamePlayer, setStatus }: Props) {
  const btnLabel = isHost ? 'Host' : player.sessionId ? 'Drop' : 'Open'

  return (
    <PlayerWrapper>
      <NameEditor value={player.name || ''} onSubmit={(name) => renamePlayer(name, player.id, true)} {...setupLimits.name} />
      <DropButton onClick={btnLabel === 'Drop' ? () => setStatus(player.id, 'leave', true) : undefined} label={btnLabel} />
    </PlayerWrapper>
  )
}