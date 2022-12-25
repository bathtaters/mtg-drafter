import type { Player } from "@prisma/client"
import type { Socket } from "types/game"
import { PlayerWrapper, NameEditor, DropButton } from "./HostModalStyles"

type Props = {
  player: Player,
  isHost: boolean,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
}

export default function PlayerEntry({ player, isHost, renamePlayer, setStatus }: Props) {
  const btnLabel = isHost ? 'Host' : player.sessionId ? 'Drop' : 'Open'

  return (
    <PlayerWrapper>
      <NameEditor value={player.name || ''} onSubmit={(name) => renamePlayer(name, player.id, true)} />
      <DropButton onClick={btnLabel === 'Drop' ? () => setStatus(player.id, 'leave', true) : undefined} label={btnLabel} />
    </PlayerWrapper>
  )
}