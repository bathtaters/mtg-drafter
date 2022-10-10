import type { Player } from "@prisma/client"
import PlayerMenu from "./PlayerMenu"
import PlayerContainerStyle, {
  EmptyPlayerContainer, ColorTheme, HostBadge,
  PlayerNameWrapper, PlayerNameEditWrapper, PlayerNameEditBtn, PlayerNameTextBox,
} from "../styles/PlayerContainerStyle"
import useRenameController, { RenameProps } from "../services/name.controller"
import { nameCharLimit } from "assets/constants"


function PlayerNameEditor(props: RenameProps) {
  const { value, isEditing, canSave, charLimit, handleSubmit, handleCancel, handleChange, enableEdit } = useRenameController(props)

  return isEditing ?
    <PlayerNameEditWrapper>
      <PlayerNameTextBox value={value} onChange={handleChange} {...charLimit} />
      <PlayerNameEditBtn value="S" onClick={handleSubmit} disabled={!canSave} />
      <PlayerNameEditBtn value="X" onClick={handleCancel} />
    </PlayerNameEditWrapper> :
    <PlayerNameWrapper onClick={enableEdit}>{value}</PlayerNameWrapper>
}



export const PlayerContainerSmall = ({ player, holding, maxPick, color, isHost }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} showDot={isHost}>
    <div className="text-xs mt-0.5">Pick {!player.pick || player.pick > maxPick ? '-' : player.pick}</div>
    <div className="text-2xs">Holding {holding ?? '-'}</div>
  </PlayerContainerStyle>
)


export const PlayerContainerFull = ({ player, holding, maxPick, openLands, openHost, dropPlayer, renamePlayer }: ContainerFullProps) => player ? (
  <PlayerContainerStyle color="self" showDot={!!openHost}
    title={<PlayerNameEditor name={player.name || 'Player'} charLimit={nameCharLimit} onSubmit={renamePlayer} />}
    header={<span>You{!!openHost && <HostBadge />}</span>}
    subtitle={`Pick ${!player.pick || player.pick > maxPick ? '-' : player.pick} | Holding ${holding ?? '-'}`}
  >
    <PlayerMenu openLands={openLands} openHost={openHost} dropPlayer={dropPlayer} />
  </PlayerContainerStyle>
) : <EmptyPlayerContainer />


interface ContainerProps {
  player: Player,
  maxPick: number,
  holding?: number,
}

interface ContainerFullProps extends ContainerProps {
  openLands:  (() => void) | null,
  openHost: (() => void) | null,
  dropPlayer: (() => void) | null,
  renamePlayer: ((name: string) => void),
}
interface ContainerSmallProps extends ContainerProps {
  color: ColorTheme,
  isHost: boolean,
}