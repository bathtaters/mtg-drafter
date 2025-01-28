import type { BasicPlayer, Socket } from "types/game"
import { PlayerWrapper, NameEditor, PlayerButton } from "./HostModalStyles"
import { getPlayerButtonData, type SetHost } from "./host.controller"
import { setupLimits } from "assets/constants"

type Props = {
  player: BasicPlayer,
  isHost: boolean,
  renamePlayer: Socket.RenamePlayer,
  setStatus: Socket.SetStatus,
  setHost: SetHost,
}

export default function PlayerEntry({ player, isHost, renamePlayer, setStatus, setHost }: Props) {
  const buttonData = getPlayerButtonData(player.id, player.sessionId, isHost, setStatus, setHost)

  return (
    <PlayerWrapper>
      <PlayerButton {...buttonData} />

      <NameEditor
        value={player.name || ''}
        onSubmit={(name) => renamePlayer(name, player.id, true)}
        {...setupLimits.name}
      />
    </PlayerWrapper>
  )
}
