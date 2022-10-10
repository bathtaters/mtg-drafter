import type { Player } from "@prisma/client"
import PlayerMenu from "./PlayerMenu"
import PlayerContainerStyle, { EmptyPlayerContainer, ColorTheme, HostBadge } from "../styles/PlayerContainerStyle"

export const PlayerContainerSmall = ({ player, holding, maxPick, color, isHost }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} showDot={isHost}>
    <div className="text-xs mt-0.5">Pick {!player.pick || player.pick > maxPick ? '-' : player.pick}</div>
    <div className="text-2xs">Holding {holding ?? '-'}</div>
  </PlayerContainerStyle>
)


export const PlayerContainerFull = ({ player, holding, maxPick, openLands, openHost, dropPlayer }: ContainerFullProps) => player ? (
  <PlayerContainerStyle title={player.name} color="self" showDot={!!openHost}
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
}
interface ContainerSmallProps extends ContainerProps {
  color: ColorTheme,
  isHost: boolean,
}