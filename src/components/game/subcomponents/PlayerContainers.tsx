import type { Player } from "@prisma/client"
import PlayerMenu from "./PlayerMenu"
import PlayerContainerStyle, { ColorTheme } from "../styles/PlayerContainerStyle"

export const PlayerContainerSmall = ({ player, holding, maxPick, color, openHost }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} showDot={!!openHost}>
    <div className="text-xs mt-0.5">Pick {!player.pick || player.pick > maxPick ? '-' : player.pick}</div>
    <div className="text-2xs">Holding {holding ?? '-'}</div>
  </PlayerContainerStyle>
)


export const PlayerContainerFull = ({ player, holding, maxPick, openLands, openHost }: ContainerFullProps) => (
  <PlayerContainerStyle title={player.name} color="self" showDot={!!openHost}
    header={`Player${openHost ? ' (Host)' : ''}`}
    subtitle={`Pick ${!player.pick || player.pick > maxPick ? '-' : player.pick} | Holding ${holding ?? '-'}`}
  >
    <PlayerMenu openLands={openLands} openHost={openHost} />
  </PlayerContainerStyle>
)


interface ContainerProps {
  player: Player,
  maxPick: number,
  holding?: number,
  openHost: (() => void) | null,
}

interface ContainerFullProps extends ContainerProps {
  openLands: (() => void) | null,
}
interface ContainerSmallProps extends ContainerProps {
  color: ColorTheme
}