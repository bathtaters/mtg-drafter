import type { Player } from "@prisma/client"
import { useState } from "react"
import PlayerMenu from "./PlayerMenu"
import PlayerContainerStyle, { ColorTheme } from "./PlayerContainerStyle"
import { EmptyPlayerContainer, StatsStyle, PlayerNameEditor, UserHeader, FullStatsWrapper, FullStatsDivider } from "./PlayerContainerElemStyles"
import { setupLimits } from "assets/constants"


export const PlayerContainerSmall = ({ player, holding, maxPick, color, isHost }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} isHost={isHost}>
    <StatsStyle isMini={true} type="pick"    count={!player.pick || player.pick > maxPick ? undefined : player.pick} />
    <StatsStyle isMini={true} type="holding" count={holding} />
  </PlayerContainerStyle>
)


export const PlayerContainerFull = ({ player, holding, maxPick, isConnected, saveDeck, openLands, openHost, dropPlayer, renamePlayer }: ContainerFullProps) => {
  const [ editingName, setEditingName ] = useState(false)
  
  if (!player) return <EmptyPlayerContainer />
  
  return (
    <PlayerContainerStyle color="self" isHost={!!openHost}

      title={<PlayerNameEditor
        value={player.name || 'Player'} {...setupLimits.name}
        isEditing={editingName} setEditing={setEditingName} onSubmit={renamePlayer}
      />}

      header={<UserHeader isHost={!!openHost} isConnected={isConnected} />}

      subtitle={<FullStatsWrapper>
        <StatsStyle type="pick" count={!player.pick || player.pick > maxPick ? undefined : player.pick} />
        <FullStatsDivider />
        <StatsStyle type="holding" count={holding} />
      </FullStatsWrapper>}
    >

      <PlayerMenu
        saveDeck={saveDeck} openLands={openLands}
        editName={editingName ? undefined : () => setEditingName(true)}
        openHost={openHost} dropPlayer={dropPlayer}
      />
      
    </PlayerContainerStyle>
  )
}


interface ContainerProps {
  player: Player,
  maxPick: number,
  holding?: number,
}

interface ContainerFullProps extends ContainerProps {
  isConnected: boolean
  saveDeck?:  (() => void),
  openLands?:  (() => void)
  openHost?: (() => void),
  dropPlayer?: (() => void),
  renamePlayer: ((name: string) => void),
}
interface ContainerSmallProps extends ContainerProps {
  color: ColorTheme,
  isHost: boolean,
}