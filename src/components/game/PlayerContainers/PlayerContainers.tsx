import type { BasicPlayer } from "types/game"
import PlayerContainerStyle, { ColorTheme } from "./PlayerContainerStyle"
import { EmptyPlayerContainer, StatsStyle, PlayerNameEditor, UserHeader, FullStatsWrapper, FullStatsDivider } from "./PlayerContainerElemStyles"
import { setupLimits } from "assets/constants"


export const PlayerContainerSmall = ({ player, holding, packSize, color, isHost, hideStats }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} isHost={isHost}>
    { hideStats ? <StatsStyle /> : <>
      <StatsStyle isMini={true} type="pick"    count={!player.pick || player.pick > packSize ? undefined : player.pick} />
      <StatsStyle isMini={true} type="holding" count={typeof holding === 'number' ? Math.max(holding,0) : holding} />
    </>}
  </PlayerContainerStyle>
)


export const PlayerContainerFull = ({ player, holding, packSize, isHost, hideStats, isConnected, isEditing, setEditing, renamePlayer }: ContainerFullProps) => {
  
  if (!player) return <EmptyPlayerContainer />
  
  return (
    <PlayerContainerStyle color="self" isHost={isHost}

      title={<PlayerNameEditor
        value={player.name || 'Player'} {...setupLimits.name}
        isEditing={isEditing} setEditing={setEditing} onSubmit={renamePlayer}
      />}

      header={<UserHeader isHost={isHost} isConnected={isConnected} />}

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
}

interface ContainerFullProps extends ContainerProps {
  isConnected: boolean,
  isEditing: boolean,
  setEditing?:  ((isEditing: boolean) => void),
  renamePlayer: ((name: string) => void),
}
interface ContainerSmallProps extends ContainerProps {
  color?: ColorTheme,
}