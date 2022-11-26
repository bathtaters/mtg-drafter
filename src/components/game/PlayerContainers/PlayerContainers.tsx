import type { Player } from "@prisma/client"
import { useState } from "react"
import PlayerMenu from "./PlayerMenu"
import PlayerContainerStyle, { ColorTheme } from "./PlayerContainerStyle"
import { EmptyPlayerContainer, HostBadge, PlayerNameEditor } from "./PlayerContainerElemStyles"
import { nameCharLimit } from "assets/constants"


export const PlayerContainerSmall = ({ player, holding, maxPick, color, isHost }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} isHost={isHost}>
    <div className="text-xs mt-0.5 whitespace-nowrap">Pick {!player.pick || player.pick > maxPick ? '-' : player.pick}</div>
    <div className="text-2xs whitespace-nowrap">Holding {holding ?? '-'}</div>
  </PlayerContainerStyle>
)


export const PlayerContainerFull = ({ player, holding, maxPick, saveDeck, openLands, openHost, dropPlayer, renamePlayer }: ContainerFullProps) => {
  const [ editingName, setEditingName ] = useState(false)
  
  if (!player) return <EmptyPlayerContainer />
  
  return (
    <PlayerContainerStyle color="self" isHost={!!openHost}
      title={<PlayerNameEditor
        value={player.name || 'Player'} {...nameCharLimit}
        isEditing={editingName} setEditing={setEditingName} onSubmit={renamePlayer}
      />}
      header={<span>You{!!openHost && <HostBadge />}</span>}
      subtitle={`Pick ${!player.pick || player.pick > maxPick ? '-' : player.pick} | Holding ${holding ?? '-'}`}
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