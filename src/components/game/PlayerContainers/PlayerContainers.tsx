import type { BasicPlayer } from "types/game"
import PlayerContainerStyle, { ColorTheme } from "./PlayerContainerStyle"
import { EmptyPlayerContainer, StatsStyle, PlayerNameEditor, UserHeader, FullStatsWrapper, FullStatsDivider } from "./PlayerContainerElemStyles"
import { setupLimits } from "assets/constants"


export const PlayerContainerSmall = ({ player, holding, packSize, color, isBot, isHost, hideStats, className }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} isBot={isBot} isHost={isHost} className={className}>
    { hideStats ? <StatsStyle /> : <>
      <StatsStyle isMini={true} type="pick"    count={!player.pick || player.pick > packSize ? undefined : player.pick} />
      <StatsStyle isMini={true} type="holding" count={typeof holding === 'number' ? Math.max(holding,0) : holding} />
    </>}
  </PlayerContainerStyle>
)


export const PlayerContainerFull = ({ player, holding, packSize, isHost, hideStats, isBye, isConnected, isEditing, setEditing, renamePlayer, className }: ContainerFullProps) => {
  
  if (!player) return <EmptyPlayerContainer className={className} />
  
  return (
    <PlayerContainerStyle color="self" isHost={isHost} className={className}

      title={<PlayerNameEditor
        value={player.name || 'Player'} {...setupLimits.name}
        isEditing={isEditing} setEditing={setEditing} onSubmit={renamePlayer}
      />}

      header={<UserHeader isHost={isHost} isBye={isBye} isConnected={isConnected} />}

      subtitle={<FullStatsWrapper>{ hideStats ? <span /> : <>
        <StatsStyle type="pick" count={!player.pick || player.pick > packSize ? undefined : player.pick} />
        <FullStatsDivider />
        <StatsStyle type="holding" count={typeof holding === 'number' ? Math.max(holding,0) : holding} />
      </>}</FullStatsWrapper>}
    />
  )
}


interface ContainerProps {
  player: BasicPlayer,
  isHost: boolean,
  packSize: number,
  holding?: number,
  hideStats: boolean,
  className?: string,
}

interface ContainerFullProps extends ContainerProps {
  isBye: boolean,
  isConnected: boolean,
  isEditing: boolean,
  setEditing?:  ((isEditing: boolean) => void),
  renamePlayer: ((name: string) => void),
}
interface ContainerSmallProps extends ContainerProps {
  color?: ColorTheme,
  isBot?: boolean,
}