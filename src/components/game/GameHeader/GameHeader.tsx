import type { Dispatch, SetStateAction } from "react"
import type { GameProps } from "types/game"
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook"
import GameHeaderBase from "./GameHeaderBase"
import GameMenu from "./GameMenu"
import { PlayerContainerFull, PlayerContainerSmall } from "../PlayerContainers/PlayerContainers"
import { RoundCounter, SidebarButton, LowerContainer } from './GameHeaderStyles'
import useGameHeader from "./header.controller"
import { roundCounter } from "assets/strings"


type Props = {
  game?: GameProps['options'],
  players: GameProps['players'],
  playerIdx: number,
  holding: number[],
  packSize: number,
  isConnected: boolean,
  notify: AlertsReturn['newToast'],
  saveDeck?:   (() => void),
  dropPlayer?: (() => void),
  openLands?:  (() => void),
  openHost?:   (() => void),
  renamePlayer: ((name: string) => void),
  sidebarVisible: boolean,
  setSidebar: Dispatch<SetStateAction<boolean>>,
}


export default function GameHeader({ game, players, playerIdx, holding, packSize, isConnected, notify, openHost, renamePlayer, sidebarVisible, setSidebar, ...menuProps }: Props) {

  const { gameStatus, copyProps, hideStats, showMenu, editingName, setEditingName, enableEdit } = useGameHeader(game, players, playerIdx)
  
  if (!game) return <GameHeaderBase left={<div />} />

  return (
    <GameHeaderBase {...copyProps} notify={notify} title={game.name}
      left={players[playerIdx] &&
        <GameMenu forceShow={showMenu} editName={enableEdit} {...menuProps} />
      }
      right={<RoundCounter label={roundCounter(gameStatus, game, !players[playerIdx])} status={gameStatus} />}
    >
      
      {playerIdx >= 0 &&
        <LowerContainer end={<SidebarButton active={sidebarVisible} onClick={() => setSidebar((show) => !show)} />}>
          <PlayerContainerFull
            player={players[playerIdx]}
            holding={holding[playerIdx]}
            packSize={packSize}
            isHost={!!openHost}
            isConnected={isConnected}
            isEditing={editingName}
            setEditing={setEditingName}
            renamePlayer={renamePlayer}
            hideStats={hideStats}
          />

            {/* { players[playerIdx] && players.map((play, idx) =>

              <PlayerContainerSmall
                player={play} key={String(play.id)}
                isHost={'hostId' in game ? game.hostId === play.id : false}
                color={getPlayerColor(idx, playerIdx, oppIdx, game)}
                holding={holding[idx]}
                packSize={packSize}
                hideStats={gameStatus === 'end' || gameStatus === 'start'}
              />
              
            )} */}
        </LowerContainer>
      }
    </GameHeaderBase>
  )
}