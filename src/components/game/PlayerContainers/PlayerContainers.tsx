import type { Player } from "@prisma/client"
import { useState } from "react"
import PlayerMenu from "./PlayerMenu"
import PlayerContainerStyle, { ColorTheme } from "./PlayerContainerStyle"
import { EmptyPlayerContainer, PickStyle, HoldingStyle, PlayerNameEditor, UserHeader } from "./PlayerContainerElemStyles"
import { nameCharLimit } from "assets/constants"


export const PlayerContainerSmall = ({ player, holding, maxPick, color, isHost }: ContainerSmallProps) => (
  <PlayerContainerStyle title={player.name} isMini={true} disconnected={!player.sessionId} color={color} isHost={isHost}>
    <PickStyle count={!player.pick || player.pick > maxPick ? undefined : player.pick} />
    <HoldingStyle count={holding} />
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

      header={<UserHeader isHost={!!openHost} />}

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